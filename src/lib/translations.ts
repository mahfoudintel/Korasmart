export type Language = "en" | "fr" | "ar";

export const languageLabels: Record<Language, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR"
};

export const translations: Record<string, { fr: string; ar: string; en?: string }> = {
  "Welcome back, Najib!": { fr: "Bon retour, Najib !", ar: "مرحبا بعودتك، نجيب!" },
  "Ready for another great game?": { fr: "Pret pour un autre grand match ?", ar: "مستعد لمباراة رائعة أخرى؟" },
  Home: { fr: "Accueil", ar: "الرئيسية" },
  Analytics: { fr: "Analytique", ar: "التحليلات" },
  Games: { fr: "Matchs", ar: "المباريات" },
  Players: { fr: "Joueurs", ar: "اللاعبون" },
  "Players Details": { fr: "Details joueurs", ar: "تفاصيل اللاعبين" },
  Teams: { fr: "Equipes", ar: "الفرق" },
  Bookings: { fr: "Reservations", ar: "الحجوزات" },
  Scheduling: { fr: "Planning", ar: "الجدولة" },
  Calendar: { fr: "Calendrier", ar: "التقويم" },
  Stats: { fr: "Stats", ar: "الإحصائيات" },
  Rankings: { fr: "Classements", ar: "الترتيب" },
  Finances: { fr: "Finances", ar: "المالية" },
  Equipment: { fr: "Materiel", ar: "المعدات" },
  Settings: { fr: "Parametres", ar: "الإعدادات" },
  "Next Game": { fr: "Prochain match", ar: "المباراة القادمة" },
  Monday: { fr: "Lundi", ar: "الإثنين" },
  "Field A": { fr: "Terrain A", ar: "الملعب أ" },
  "Dabat Animations": { fr: "Dabat Animations", ar: "دابات أنيماسيون" },
  "I'M PLAYING": { fr: "JE JOUE", ar: "سألعب" },
  Attendance: { fr: "Presence", ar: "الحضور" },
  "First 10 members who sign up are confirmed. Later signups join the waiting list automatically.": {
    fr: "Les 10 premiers membres inscrits sont confirmes. Les suivants passent automatiquement en liste d'attente.",
    ar: "أول 10 أعضاء يسجلون يتم تأكيدهم. الباقون ينتقلون تلقائيا إلى قائمة الانتظار."
  },
  Playing: { fr: "Je joue", ar: "سألعب" },
  Waiting: { fr: "Attente", ar: "قائمة الانتظار" },
  "Join waitlist": { fr: "Liste attente", ar: "انضم للانتظار" },
  Maybe: { fr: "Peut-etre", ar: "ربما" },
  Out: { fr: "Absent", ar: "لن ألعب" },
  Member: { fr: "Membre", ar: "العضو" },
  "Waiting list": { fr: "Liste d'attente", ar: "قائمة الانتظار" },
  "No confirmed players yet.": { fr: "Aucun joueur confirme pour le moment.", ar: "لا يوجد لاعبون مؤكدون بعد." },
  "Waiting list is empty.": { fr: "La liste d'attente est vide.", ar: "قائمة الانتظار فارغة." },
  "Marked as maybe. Your spot is not reserved yet.": {
    fr: "Marque comme peut-etre. Votre place n'est pas encore reservee.",
    ar: "تم تسجيلك كربما. مكانك غير محجوز بعد."
  },
  "Marked out. If a waiting player exists, the first one moves up automatically.": {
    fr: "Marque absent. S'il y a un joueur en attente, le premier monte automatiquement.",
    ar: "تم تسجيلك كغائب. إذا كان هناك لاعب في الانتظار، ينتقل الأول تلقائيا."
  },
  "No reservation scheduled.": { fr: "Aucune reservation planifiee.", ar: "لا يوجد حجز مبرمج." },
  "Add reservation": { fr: "Ajouter reservation", ar: "إضافة حجز" },
  Balance: { fr: "Caisse", ar: "الصندوق" },
  "Situation caisse": { fr: "Situation caisse", ar: "وضع الصندوق" },
  "Next Game Preview": { fr: "Apercu du prochain match", ar: "معاينة المباراة القادمة" },
  "FLUORESCENT TEAM": { fr: "EQUIPE FLUO", ar: "الفريق الفوسفوري" },
  "ORANGE TEAM": { fr: "EQUIPE ORANGE", ar: "الفريق البرتقالي" },
  "VIEW GAME DETAILS": { fr: "VOIR LES DETAILS DU MATCH", ar: "عرض تفاصيل المباراة" },
  "Upcoming Games": { fr: "Matchs a venir", ar: "المباريات القادمة" },
  Today: { fr: "Aujourd'hui", ar: "اليوم" },
  "Next Monday": { fr: "Lundi prochain", ar: "الإثنين القادم" },
  "View full calendar": { fr: "Voir tout le calendrier", ar: "عرض التقويم الكامل" },
  "Quick Actions": { fr: "Actions rapides", ar: "إجراءات سريعة" },
  "Add Result": { fr: "Ajouter resultat", ar: "إضافة نتيجة" },
  "Invite Player": { fr: "Inviter joueur", ar: "دعوة لاعب" },
  "Generate Teams": { fr: "Generer equipes", ar: "توليد الفرق" },
  "Add Expense": { fr: "Ajouter depense", ar: "إضافة مصروف" },
  "Recent Result": { fr: "Dernier resultat", ar: "آخر نتيجة" },
  "View match summary": { fr: "Voir le resume", ar: "عرض ملخص المباراة" },
  "Top Performers": { fr: "Meilleurs joueurs", ar: "أفضل اللاعبين" },
  "Goal Leaders": { fr: "Meilleurs buteurs", ar: "هدافون" },
  "View all rankings": { fr: "Voir tous les classements", ar: "عرض كل الترتيب" },
  "Budget Overview": { fr: "Vue caisse", ar: "نظرة مالية" },
  "This Month": { fr: "Ce mois", ar: "هذا الشهر" },
  Caisse: { fr: "Caisse", ar: "الصندوق" },
  Cotisations: { fr: "Cotisations", ar: "المساهمات" },
  "Reserve until": { fr: "Reserve jusqu'au", ar: "محجوز إلى" },
  "Top Scorer": { fr: "Meilleur buteur", ar: "الهداف" },
  "Team Chemistry": { fr: "Chimie d'equipe", ar: "انسجام الفريق" },
  "Great rhythm, high attendance, clean balance.": {
    fr: "Bon rythme, forte presence, bon equilibre.",
    ar: "إيقاع جيد، حضور قوي، وتوازن واضح."
  },
  goals: { fr: "buts", ar: "أهداف" },
  Available: { fr: "Disponible", ar: "متاح" },
  Confirmed: { fr: "Confirme", ar: "مؤكد" },
  "One team. One dream.": { fr: "Une equipe. Un reve.", ar: "فريق واحد. حلم واحد." },
  "Play fair. Respect all. Enjoy the game.": {
    fr: "Fair-play. Respect pour tous. Profitez du match.",
    ar: "العب بنزاهة. احترم الجميع. استمتع بالمباراة."
  },
  "Monday match timeline with attendance, score, MVP, comments, expenses, and post-game flow.": {
    fr: "Chronologie des matchs du lundi avec presence, score, MVP, commentaires, depenses et apres-match.",
    ar: "خط زمني لمباريات الإثنين مع الحضور والنتيجة وأفضل لاعب والتعليقات والمصاريف وما بعد المباراة."
  },
  "Player Scores": { fr: "Notes des joueurs", ar: "تقييم اللاعبين" },
  "One player can submit scores for the full group after a match. These values are shaped to link back to player profiles later.": {
    fr: "Un joueur peut saisir les notes de tout le groupe apres le match. Ces valeurs seront reliees aux profils plus tard.",
    ar: "يمكن للاعب واحد إدخال تقييمات المجموعة كاملة بعد المباراة. سيتم ربط هذه القيم بملفات اللاعبين لاحقا."
  },
  "Submitted by": { fr: "Saisi par", ar: "أدخلها" },
  "players scored": { fr: "joueurs notes", ar: "لاعبا تم تقييمهم" },
  "Average score": { fr: "Note moyenne", ar: "متوسط التقييم" },
  "Save score set": { fr: "Enregistrer les notes", ar: "حفظ التقييمات" },
  "Match summary": { fr: "Resume du match", ar: "ملخص المباراة" },
  "Game plan": { fr: "Plan du match", ar: "خطة المباراة" },
  "Scorers, assists, MVP voting, player ratings, notes, comments, and photos are ready for Supabase sync.": {
    fr: "Buteurs, passes, vote MVP, notes, commentaires et photos sont prets pour Supabase.",
    ar: "الهدافون والتمريرات وتصويت أفضل لاعب والتقييمات والملاحظات والصور جاهزة للمزامنة مع Supabase."
  },
  Score: { fr: "Score", ar: "النتيجة" },
  MVP: { fr: "MVP", ar: "أفضل لاعب" },
  Expense: { fr: "Depense", ar: "مصروف" },
  "A quick read on form, skill profile, personal stats, and who is carrying the weekly rhythm.": {
    fr: "Lecture rapide de la forme, du profil technique, des stats personnelles et des joueurs en forme.",
    ar: "نظرة سريعة على المستوى والمهارات والإحصائيات ومن يقود الإيقاع الأسبوعي."
  },
  Skill: { fr: "Niveau", ar: "المهارة" },
  Technique: { fr: "Technique", ar: "التقنية" },
  Speed: { fr: "Vitesse", ar: "السرعة" },
  Stamina: { fr: "Endurance", ar: "اللياقة" },
  Passing: { fr: "Passe", ar: "التمرير" },
  Defense: { fr: "Defense", ar: "الدفاع" },
  Shooting: { fr: "Tir", ar: "التسديد" },
  Goals: { fr: "Buts", ar: "الأهداف" },
  Assists: { fr: "Passes", ar: "تمريرات حاسمة" },
  Wins: { fr: "Victoires", ar: "انتصارات" },
  "Team Generator": { fr: "Generateur d'equipes", ar: "مولد الفرق" },
  "Smart balancing using skill, speed, stamina, historic performance, goals, wins, and attendance.": {
    fr: "Equilibrage intelligent avec niveau, vitesse, endurance, historique, buts, victoires et presence.",
    ar: "توازن ذكي حسب المهارة والسرعة واللياقة والأداء السابق والأهداف والانتصارات والحضور."
  },
  "Chemistry score": { fr: "Score de chimie", ar: "درجة الانسجام" },
  "Admin area for adding reservations and updating the calendar after each booking.": {
    fr: "Zone admin pour ajouter les reservations et mettre a jour le calendrier apres chaque reservation.",
    ar: "منطقة الإدارة لإضافة الحجوزات وتحديث التقويم بعد كل حجز."
  },
  "Reservation Admin": { fr: "Admin reservations", ar: "إدارة الحجوزات" },
  "Add or update bookings here. Calendar uses this same list and changes are saved locally until Supabase is connected.": {
    fr: "Ajoutez ou modifiez les reservations ici. Le calendrier utilise la meme liste et les changements sont sauvegardes localement jusqu'a Supabase.",
    ar: "أضف أو عدل الحجوزات هنا. يستخدم التقويم نفس القائمة وتحفظ التغييرات محليا إلى أن يتم ربط Supabase."
  },
  Date: { fr: "Date", ar: "التاريخ" },
  Time: { fr: "Heure", ar: "الوقت" },
  Venue: { fr: "Lieu", ar: "المكان" },
  Field: { fr: "Terrain", ar: "الملعب" },
  Duration: { fr: "Duree", ar: "المدة" },
  Status: { fr: "Statut", ar: "الحالة" },
  Upcoming: { fr: "A venir", ar: "قادم" },
  Past: { fr: "Passe", ar: "سابق" },
  Cancelled: { fr: "Annule", ar: "ملغى" },
  "Save reservation": { fr: "Enregistrer reservation", ar: "حفظ الحجز" },
  Reset: { fr: "Reinitialiser", ar: "إعادة ضبط" },
  "Next Reservation": { fr: "Prochaine reservation", ar: "الحجز القادم" },
  "All Reservations": { fr: "Toutes les reservations", ar: "كل الحجوزات" },
  "Add next Monday": { fr: "Ajouter lundi suivant", ar: "إضافة الإثنين القادم" },
  "Confirmed football reservations and weekly booking timeline.": {
    fr: "Reservations football confirmees et calendrier hebdomadaire.",
    ar: "حجوزات كرة القدم المؤكدة والجدول الأسبوعي."
  },
  "Reserved Slots": { fr: "Creneaux reserves", ar: "المواعيد المحجوزة" },
  Reserved: { fr: "Reserve", ar: "محجوز" },
  "Reservation Summary": { fr: "Resume reservations", ar: "ملخص الحجوزات" },
  "upcoming weekly reservations": { fr: "reservations hebdomadaires a venir", ar: "حجوزات أسبوعية قادمة" },
  "Next reservation": { fr: "Prochaine reservation", ar: "الحجز القادم" },
  "No reservation": { fr: "Aucune reservation", ar: "لا يوجد حجز" },
  "Situation de la caisse, cotisations recues, reservation terrain, and admin updates.": {
    fr: "Situation de la caisse, cotisations recues, reservation terrain et mises a jour admin.",
    ar: "وضع الصندوق والمساهمات المستلمة وحجز الملعب وتحديثات الإدارة."
  },
  "Nouvelle situation de la caisse a ce jour": {
    fr: "Nouvelle situation de la caisse a ce jour",
    ar: "الوضع الحالي للصندوق حتى اليوم"
  },
  "Cotisations recues": { fr: "Cotisations recues", ar: "المساهمات المستلمة" },
  "joueurs ont deja cotise": { fr: "joueurs ont deja cotise", ar: "لاعبا ساهموا بالفعل" },
  "Reservation terrain": { fr: "Reservation terrain", ar: "حجز الملعب" },
  "Reserve chaque semaine": { fr: "Reserve chaque semaine", ar: "محجوز كل أسبوع" },
  "Cotisations par joueur": { fr: "Cotisations par joueur", ar: "المساهمات حسب اللاعب" },
  "Admin peut mettre a jour les montants avant connexion Supabase.": {
    fr: "Admin peut mettre a jour les montants avant connexion Supabase.",
    ar: "يمكن للإدارة تحديث المبالغ قبل ربط Supabase."
  },
  "Admin edit": { fr: "Modifier admin", ar: "تعديل الإدارة" },
  "Done editing": { fr: "Terminer", ar: "إنهاء التعديل" },
  "Received Payments": { fr: "Paiements recus", ar: "المدفوعات المستلمة" },
  "Still To Collect": { fr: "Reste a encaisser", ar: "المتبقي تحصيله" },
  "Quick Read": { fr: "Lecture rapide", ar: "ملخص سريع" },
  "All players have a recorded contribution.": {
    fr: "Tous les joueurs ont une cotisation enregistree.",
    ar: "كل اللاعبين لديهم مساهمة مسجلة."
  },
  "needed to bring the caisse back to zero.": {
    fr: "necessaires pour remettre la caisse a zero.",
    ar: "مطلوبة لإرجاع الصندوق إلى الصفر."
  },
  "Use admin edit now; later these edits should save to `payments`, `expenses`, and a finance snapshot in Supabase.": {
    fr: "Utilisez la modification admin maintenant ; plus tard ces changements seront sauvegardes dans Supabase.",
    ar: "استخدم تعديل الإدارة الآن؛ لاحقا سيتم حفظ هذه التغييرات في Supabase."
  }
};

export function translateText(text: string, language: Language) {
  if (language === "en") {
    for (const [source, values] of Object.entries(translations)) {
      if (source === text || values.fr === text || values.ar === text || values.en === text) {
        return source;
      }
    }

    return text;
  }

  const direct = translations[text]?.[language];
  if (direct) return direct;

  for (const [source, values] of Object.entries(translations)) {
    if (values.fr === text || values.ar === text || values.en === text) {
      return translations[source][language] || source;
    }
  }

  return text;
}
