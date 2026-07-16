"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, FileImage, Plus, ScanText, Save, Trash2, Upload, X } from "lucide-react";
import { SectionTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { useReservations } from "@/hooks/use-reservations";
import type { Reservation, ReservationStatus } from "@/lib/reservations";
import { translateText } from "@/lib/translations";
import { cn } from "@/lib/utils";

type ImportRow = {
  id: string;
  date: string;
  time: string;
  venue: string;
  field: string;
  durationMinutes: number;
  price: number;
  status: ReservationStatus;
};

const defaultVenue = "LYCEE IBN ROCHD";
const defaultField = "F6-10";

const monthNumbers: Record<string, string> = {
  janvier: "01",
  fevrier: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  aout: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  decembre: "12"
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function pad(value: string | number) {
  return String(value).padStart(2, "0");
}

function rowId(date: string, time: string) {
  return time === "20:00" ? `res-${date}` : `res-${date}-${time.replace(":", "")}`;
}

function getDuration(startHour: number, startMinute: number, endHour: number, endMinute: number) {
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const duration = end - start;
  return duration > 0 ? duration : 60;
}

function blankRow(): ImportRow {
  const date = new Date().toISOString().slice(0, 10);
  const time = "20:00";

  return {
    id: rowId(date, time),
    date,
    time,
    venue: defaultVenue,
    field: defaultField,
    durationMinutes: 60,
    price: 80,
    status: "upcoming"
  };
}

function parseReservationText(rawText: string) {
  const text = normalizeText(rawText);
  const year = new Date().getFullYear();
  const venue = text.includes("lycee ibn rochd") ? defaultVenue : defaultVenue;
  const rows: ImportRow[] = [];
  const seen = new Set<string>();
  const monthPattern = "janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre";
  const regex = new RegExp(
    `(\\d{1,2})\\s+(${monthPattern})[\\s\\S]{0,140}?(\\d{1,2})[:h](\\d{2})\\s*[-–]\\s*(\\d{1,2})[:h](\\d{2})(?:[\\s\\S]{0,140}?(\\d+(?:[,.]\\d+)?)\\s*(?:dh|mad))?`,
    "gi"
  );

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    const [, day, monthName, startHour, startMinute, endHour, endMinute, price] = match;
    const month = monthNumbers[monthName];
    if (!month) continue;

    const date = `${year}-${month}-${pad(day)}`;
    const time = `${pad(startHour)}:${pad(startMinute)}`;
    const key = `${date}-${time}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push({
      id: rowId(date, time),
      date,
      time,
      venue,
      field: defaultField,
      durationMinutes: getDuration(Number(startHour), Number(startMinute), Number(endHour), Number(endMinute)),
      price: price ? Number(price.replace(",", ".")) || 80 : 80,
      status: "upcoming"
    });
  }

  return rows;
}
export function ReservationImportModal({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const { upsertReservation } = useReservations();
  const t = (text: string) => translateText(text, language);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [parseMessage, setParseMessage] = useState("");
  const [ocrStatus, setOcrStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const totalPrice = useMemo(() => rows.reduce((total, row) => total + row.price, 0), [rows]);

  const chooseImage = (file?: File) => {
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setOcrStatus("idle");
    setOcrProgress(0);
    setParseMessage(t("Image selected. Paste text or add rows, then review before saving."));
  };

  const applyParsedText = (sourceText: string) => {
    const parsedRows = parseReservationText(sourceText);
    setRows(parsedRows);
    setSaveStatus("idle");
    setSaveMessage("");
    setParseMessage(
      parsedRows.length
        ? `${parsedRows.length} ${t("rows found")}. ${t("Review before saving.")}`
        : t("No rows parsed yet. Paste reservation text or add a row manually.")
    );
  };

  const parseText = () => {
    applyParsedText(text);
  };

  const readImage = async () => {
    if (!imageFile) {
      setOcrStatus("error");
      setParseMessage(t("Choose a screenshot first."));
      return;
    }

    try {
      setOcrStatus("reading");
      setOcrProgress(0);
      setParseMessage(t("Reading screenshot..."));
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(imageFile, "fra+eng", {
        logger: (message) => {
          if (message.status) setParseMessage(`${t("Reading screenshot...")} ${message.status}`);
          if (typeof message.progress === "number") setOcrProgress(Math.round(message.progress * 100));
        }
      });
      const extractedText = result.data.text.trim();
      setText(extractedText);
      applyParsedText(extractedText);
      setOcrStatus("done");
      setOcrProgress(100);
    } catch {
      setOcrStatus("error");
      setParseMessage(t("OCR could not read this image. Paste the text or add rows manually."));
    }
  };

  const updateRow = <Key extends keyof ImportRow>(id: string, key: Key, value: ImportRow[Key]) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, [key]: value };
        if (key === "date" || key === "time") next.id = rowId(next.date, next.time);
        return next;
      })
    );
  };

  const addRow = () => {
    const row = blankRow();
    setRows((current) => [...current, { ...row, id: `${row.id}-${current.length + 1}` }]);
    setParseMessage(t("Review before saving."));
  };

  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const saveRows = async () => {
    if (!rows.length) {
      setSaveStatus("error");
      setSaveMessage(t("No rows parsed yet. Paste reservation text or add a row manually."));
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");
    const failures: string[] = [];

    for (const row of rows) {
      const reservation: Reservation = {
        id: rowId(row.date, row.time),
        date: row.date,
        time: row.time,
        venue: row.venue,
        field: row.field,
        durationMinutes: row.durationMinutes,
        sport: "Football",
        status: row.status
      };
      const result = await upsertReservation(reservation);
      if (!result.ok) failures.push(`${row.date} ${row.time}: ${result.error || t("Booking could not be saved.")}`);
    }

    if (failures.length) {
      setSaveStatus("error");
      setSaveMessage(`${t("Some bookings could not be saved.")} ${failures.join(" ")}`);
      return;
    }

    setSaveStatus("saved");
    setSaveMessage(t("Booking import saved."));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,.30)] sm:p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <SectionTitle>{t("Import reservations")}</SectionTitle>
            <h2 className="mt-2 text-2xl font-black tracking-normal text-slate-950">{t("Upload reservation screenshot")}</h2>
          </div>
          <button onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-lime-300 bg-lime-50/70 p-4 text-center">
              <Upload className="h-8 w-8 text-[#247e24]" />
              <span className="mt-3 text-sm font-black text-slate-950">{t("Choose screenshot")}</span>
              <span className="mt-1 text-xs font-bold text-slate-500">{t("The image stays in this browser for review.")}</span>
              <input className="hidden" type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files?.[0])} />
            </label>
            {imageUrl && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-2">
                <img src={imageUrl} alt={t("Screenshot reference")} className="max-h-[320px] w-full rounded-2xl object-contain" />
                <button onClick={readImage} disabled={ocrStatus === "reading"} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#102033] px-4 font-black text-white disabled:opacity-60">
                  <ScanText className="h-4 w-4" />
                  {ocrStatus === "reading" ? `${t("Reading image")} ${ocrProgress}%` : t("Read image")}
                </button>
                {ocrStatus === "reading" && (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-lime-400 transition-all" style={{ width: `${ocrProgress}%` }} />
                  </div>
                )}
              </div>
            )}
            {!imageUrl && (
              <div className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <FileImage className="mt-1 h-5 w-5 text-slate-500" />
                <p className="text-sm font-bold leading-6 text-slate-600">{t("Upload the Rabat Animation screenshot, then paste the reservation text or add rows manually.")}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-600">
              {t("Paste reservation text")}
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="3 aout 20:00 - 21:00 80,00 DH"
                className="mt-2 min-h-36 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 font-bold text-slate-950 outline-none focus:border-lime-400"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button onClick={parseText} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white">
                <CalendarPlus className="h-4 w-4" />
                {t("Parse reservations")}
              </button>
              <button onClick={addRow} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 font-black text-slate-800">
                <Plus className="h-4 w-4" />
                {t("Add row")}
              </button>
            </div>
            {parseMessage && <p className="rounded-2xl bg-lime-50 p-3 text-sm font-black text-[#247e24]">{parseMessage}</p>}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle>{t("Review before saving")}</SectionTitle>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
              {rows.length} {t("rows")} | {totalPrice} DH
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {rows.length ? (
              rows.map((row) => (
                <div key={row.id} className="grid gap-3 rounded-2xl border border-white bg-white/82 p-3 lg:grid-cols-[1fr_1fr_1.2fr_.85fr_.65fr_.75fr_auto] lg:items-end">
                  <label className="text-xs font-black uppercase tracking-[.08em] text-slate-500">
                    {t("Date")}
                    <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-black text-slate-950" type="date" value={row.date} onChange={(event) => updateRow(row.id, "date", event.target.value)} />
                  </label>
                  <label className="text-xs font-black uppercase tracking-[.08em] text-slate-500">
                    {t("Time")}
                    <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-black text-slate-950" type="time" value={row.time} onChange={(event) => updateRow(row.id, "time", event.target.value)} />
                  </label>
                  <label className="text-xs font-black uppercase tracking-[.08em] text-slate-500">
                    {t("Location")}
                    <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-black text-slate-950" value={row.venue} onChange={(event) => updateRow(row.id, "venue", event.target.value)} />
                  </label>
                  <label className="text-xs font-black uppercase tracking-[.08em] text-slate-500">
                    {t("Duration")}
                    <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-black text-slate-950" type="number" min={30} step={15} value={row.durationMinutes} onChange={(event) => updateRow(row.id, "durationMinutes", Number(event.target.value))} />
                  </label>
                  <label className="text-xs font-black uppercase tracking-[.08em] text-slate-500">
                    {t("Price")}
                    <input className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-black text-slate-950" type="number" min={0} value={row.price} onChange={(event) => updateRow(row.id, "price", Number(event.target.value))} />
                  </label>
                  <label className="text-xs font-black uppercase tracking-[.08em] text-slate-500">
                    {t("Status")}
                    <select className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-black text-slate-950" value={row.status} onChange={(event) => updateRow(row.id, "status", event.target.value as ReservationStatus)}>
                      <option value="upcoming">{t("Upcoming")}</option>
                      <option value="past">{t("Past")}</option>
                      <option value="cancelled">{t("Cancelled")}</option>
                    </select>
                  </label>
                  <button onClick={() => removeRow(row.id)} className="inline-flex h-11 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-3 text-orange-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-white/75 p-4 text-sm font-bold text-slate-600">{t("No rows parsed yet. Paste reservation text or add a row manually.")}</p>
            )}
          </div>
        </div>

        {saveMessage && <p className={cn("mt-4 rounded-2xl p-3 text-sm font-black", saveStatus === "error" ? "bg-orange-50 text-orange-700" : "bg-lime-50 text-[#247e24]")}>{saveMessage}</p>}

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button onClick={onClose} className="h-12 rounded-2xl border border-slate-200 bg-white px-5 font-black text-slate-700">{t("Cancel")}</button>
          <button onClick={saveRows} disabled={saveStatus === "saving"} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#35b43a] px-6 font-black text-white disabled:opacity-60">
            <Save className="h-5 w-5" />
            {saveStatus === "saving" ? t("Saving...") : t("Save bookings")}
          </button>
        </div>
      </div>
    </div>
  );
}

