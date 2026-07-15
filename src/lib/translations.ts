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
  Matches: { fr: "Matchs", ar: "المباريات" },
  Insights: { fr: "Insights", ar: "الرؤى" },
  Admin: { fr: "Admin", ar: "الإدارة" },
  "Your next game and what matters today.": { fr: "Ton prochain match et l'essentiel du jour.", ar: "مباراتك القادمة وما يهم اليوم." },
  "Roster, availability, and peer assessment.": { fr: "Effectif, disponibilite et evaluation entre joueurs.", ar: "القائمة، التوفر، وتقييم اللاعبين." },
  "Balance, booking costs, contributions, and unpaid players.": { fr: "Solde, frais de reservation, cotisations et joueurs impayes.", ar: "الرصيد، تكاليف الحجز، المساهمات، واللاعبون غير المسددين." },
  "Player Roster": { fr: "Effectif joueurs", ar: "قائمة اللاعبين" },
  "Player Ratings": { fr: "Notes joueurs", ar: "تقييمات اللاعبين" },
  "Rating Summary": { fr: "Resume des notes", ar: "ملخص التقييمات" },
  "Account Ledger": { fr: "Grand livre", ar: "دفتر الحسابات" },
  "Account ledger": { fr: "Grand livre", ar: "دفتر الحسابات" },
  Contributions: { fr: "Cotisations", ar: "المساهمات" },
  "Total paid": { fr: "Total paye", ar: "المجموع المدفوع" },
  "Last in": { fr: "Dernier encaissement", ar: "آخر دفعة" },
  "Last amount": { fr: "Dernier montant", ar: "آخر مبلغ" },
  "Last date": { fr: "Derniere date", ar: "آخر تاريخ" },
  Remaining: { fr: "Reste", ar: "المتبقي" },
  "Opening balance": { fr: "Solde de depart", ar: "الرصيد الافتتاحي" },
  "Paid on": { fr: "Paye le", ar: "دفع في" },
  "Add payment": { fr: "Ajouter paiement", ar: "إضافة دفعة" },
  "Make contribution": { fr: "Faire une cotisation", ar: "دفع مساهمة" },
  "Payment account": { fr: "Compte de paiement", ar: "حساب الدفع" },
  "Account name": { fr: "Nom du compte", ar: "اسم الحساب" },
  "Payment method": { fr: "Methode de paiement", ar: "طريقة الدفع" },
  "Account details": { fr: "Details du compte", ar: "تفاصيل الحساب" },
  "Payment note": { fr: "Note paiement", ar: "ملاحظة الدفع" },
  Hide: { fr: "Masquer", ar: "إخفاء" },
  Show: { fr: "Afficher", ar: "عرض" },
  "Open this when you are ready to contribute.": {
    fr: "Ouvre ceci quand tu es pret a cotiser.",
    ar: "افتح هذا عندما تكون جاهزا للدفع."
  },
  "Cash / bank transfer": { fr: "Cash / virement bancaire", ar: "نقدا / تحويل بنكي" },
  "Ask Najib or Nawfal": { fr: "Demande a Najib ou Nawfal", ar: "اسأل نجيب أو نوفل" },
  "Send proof after payment.": {
    fr: "Envoie une preuve apres paiement.",
    ar: "أرسل إثبات الدفع بعد التحويل."
  },
  "Add contribution": { fr: "Ajouter cotisation", ar: "إضافة مساهمة" },
  "Contribution ledger": { fr: "Registre des cotisations", ar: "سجل المساهمات" },
  "Player totals, last contribution, and remaining amount.": {
    fr: "Totaux joueurs, derniere cotisation et reste.",
    ar: "إجمالي اللاعبين وآخر مساهمة والمبلغ المتبقي."
  },
  "Search player": { fr: "Chercher joueur", ar: "بحث عن لاعب" },
  "Unpaid players": { fr: "Joueurs impayes", ar: "لاعبون غير مسددين" },
  "Booking costs": { fr: "Frais de reservation", ar: "تكاليف الحجز" },
  "Booking cost is linked to matches.": {
    fr: "Les frais de reservation sont lies aux matchs.",
    ar: "تكلفة الحجز مرتبطة بالمباريات."
  },
  "New bookings deduct automatically.": {
    fr: "Les nouveaux bookings sont deduits automatiquement.",
    ar: "يتم خصم الحجوزات الجديدة تلقائيا."
  },
  "Amount needed to reach zero.": {
    fr: "Montant necessaire pour revenir a zero.",
    ar: "المبلغ المطلوب للوصول إلى الصفر."
  },
  "Caisse is positive.": { fr: "La caisse est positive.", ar: "الصندوق موجب." },
  "Total paid by players.": { fr: "Total paye par les joueurs.", ar: "إجمالي ما دفعه اللاعبون." },
  "My contribution": { fr: "Ma cotisation", ar: "مساهمتي" },
  "Finance access": { fr: "Acces finances", ar: "صلاحية المالية" },
  Transparency: { fr: "Transparence", ar: "الشفافية" },
  "You can update contributions and payment dates.": {
    fr: "Vous pouvez mettre a jour les cotisations et dates.",
    ar: "يمكنك تحديث المساهمات وتواريخ الدفع."
  },
  "Everyone can see contribution totals.": {
    fr: "Tout le monde peut voir les totaux des cotisations.",
    ar: "يمكن للجميع رؤية إجمالي المساهمات."
  },
  "No booking costs recorded yet.": {
    fr: "Aucun frais de reservation enregistre.",
    ar: "لا توجد تكاليف حجز مسجلة بعد."
  },
  "Ins, outs, and booking deductions.": {
    fr: "Entrees, sorties et deductions reservation.",
    ar: "المداخيل والمصاريف وخصومات الحجز."
  },
  Amount: { fr: "Montant", ar: "المبلغ" },
  Type: { fr: "Type", ar: "النوع" },
  In: { fr: "Entree", ar: "داخل" },
  Outflow: { fr: "Sortie", ar: "خارج" },
  Paid: { fr: "Paye", ar: "مدفوع" },
  Partial: { fr: "Partiel", ar: "جزئي" },
  Unpaid: { fr: "Impaye", ar: "غير مدفوع" },
  Contribution: { fr: "Cotisation", ar: "مساهمة" },
  Deducted: { fr: "Deduit", ar: "مخصوم" },
  Reversed: { fr: "Annule", ar: "معكوس" },
  Action: { fr: "Action", ar: "إجراء" },
  Clear: { fr: "Effacer", ar: "مسح" },
  Item: { fr: "Element", ar: "البند" },
  rows: { fr: "lignes", ar: "صفوف" },
  "Reserve a field": { fr: "Reserver un terrain", ar: "حجز ملعب" },
  "Reserve field": { fr: "Reserver terrain", ar: "احجز الملعب" },
  "Open site": { fr: "Ouvrir site", ar: "فتح الموقع" },
  "Open Rabat Animation to book the field.": {
    fr: "Ouvre Rabat Animation pour reserver le terrain.",
    ar: "افتح موقع رباط أنيميشن لحجز الملعب."
  },
  "Book the pitch on Rabat Animation.": {
    fr: "Reserve le terrain sur Rabat Animation.",
    ar: "احجز الملعب على رباط أنيميشن."
  },
  Expected: { fr: "Attendu", ar: "المتوقع" },
  "Quick update": { fr: "Mise a jour rapide", ar: "تحديث سريع" },
  "players paid": { fr: "joueurs payes", ar: "لاعبون دفعوا" },
  "Next Match": { fr: "Prochain match", ar: "المباراة القادمة" },
  "Season 2026": { fr: "Saison 2026", ar: "موسم 2026" },
  "Scheduled Games": { fr: "Matchs planifies", ar: "المباريات المجدولة" },
  "Season timeline": { fr: "Chronologie saison", ar: "مسار الموسم" },
  Match: { fr: "Match", ar: "مباراة" },
  "New Match": { fr: "Nouveau match", ar: "مباراة جديدة" },
  "No upcoming matches scheduled.": {
    fr: "Aucun match a venir planifie.",
    ar: "لا توجد مباريات قادمة مجدولة."
  },
  "No other scheduled games.": {
    fr: "Aucun autre match planifie.",
    ar: "لا توجد مباريات اخرى مجدولة."
  },
  "Registration open": { fr: "Presence ouverte", ar: "الحضور مفتوح" },
  Opens: { fr: "Ouvre", ar: "يفتح" },
  Full: { fr: "Complet", ar: "مكتمل" },
  Completed: { fr: "Termine", ar: "منتهية" },
  "You are playing": { fr: "Tu joues", ar: "انت حاضر" },
  "I'll play": { fr: "Je joue", ar: "سالعب" },
  "Can't make it": { fr: "Je ne peux pas", ar: "لن استطيع" },
  "View Match": { fr: "Voir match", ar: "عرض المباراة" },
  "View Match Details": { fr: "Voir details match", ar: "عرض تفاصيل المباراة" },
  "Stats not recorded": { fr: "Stats non enregistrees", ar: "الاحصائيات غير مسجلة" },
  "Stats not recorded yet.": { fr: "Stats pas encore enregistrees.", ar: "الاحصائيات لم تسجل بعد." },
  "Top scorer not recorded": { fr: "Buteur non enregistre", ar: "الهداف غير مسجل" },
  "No response": { fr: "Sans reponse", ar: "بدون رد" },
  "Admin actions": { fr: "Actions admin", ar: "اجراءات الادارة" },
  "Use New Match for schedule updates. Full reservation tools stay in Admin.": {
    fr: "Utilisez Nouveau match pour le calendrier. Les outils complets restent dans Admin.",
    ar: "استخدم مباراة جديدة لتحديث الجدول. ادوات الحجز الكاملة تبقى في الادارة."
  },
  "Match saved.": { fr: "Match enregistre.", ar: "تم حفظ المباراة." },
  "Booking could not be saved.": { fr: "Le booking n'a pas pu etre enregistre.", ar: "تعذر حفظ الحجز." },
  "Match not found": { fr: "Match introuvable", ar: "المباراة غير موجودة" },
  "Back to Matches": { fr: "Retour aux matchs", ar: "العودة الى المباريات" },
  "Final Score": { fr: "Score final", ar: "النتيجة النهائية" },
  "Key Stats": { fr: "Stats cles", ar: "احصائيات مهمة" },
  "Teams not recorded yet.": { fr: "Equipes pas encore enregistrees.", ar: "الفرق لم تسجل بعد." },
  "Not recorded": { fr: "Non enregistre", ar: "غير مسجل" },
  "Balanced teams": { fr: "Equipes equilibrees", ar: "فرق متوازنة" },
  "Selection pool": { fr: "Groupe selectionne", ar: "مجموعة الاختيار" },
  "Balance gap": { fr: "Ecart d'equilibre", ar: "فارق التوازن" },
  "confirmed players": { fr: "joueurs confirmes", ar: "لاعبون مؤكدون" },
  "Data used": { fr: "Donnees utilisees", ar: "البيانات المستخدمة" },
  "Teams use attendance first, then anonymous peer ratings, recorded goals, appearances, wins, and result margin.": {
    fr: "Les equipes utilisent d'abord la presence, puis les notes anonymes, buts, matchs joues, victoires et ecart de score.",
    ar: "تستخدم الفرق الحضور اولا، ثم التقييمات المجهولة، الاهداف، المشاركات، الانتصارات وفارق النتيجة."
  },
  "View on match": { fr: "Voir le match", ar: "عرض المباراة" },
  "Team A": { fr: "Equipe A", ar: "الفريق أ" },
  "Team B": { fr: "Equipe B", ar: "الفريق ب" },
  "Preview teams": { fr: "Voir les equipes", ar: "معاينة الفرق" },
  "Booking Status": { fr: "Statut paiement", ar: "حالة الدفع" },
  "Last Match": { fr: "Dernier match", ar: "آخر مباراة" },
  Budget: { fr: "Budget", ar: "الميزانية" },
  "Your Status": { fr: "Ton statut", ar: "حالتك" },
  "Upcoming Matches": { fr: "Matchs a venir", ar: "المباريات القادمة" },
  "View all": { fr: "Voir tout", ar: "عرض الكل" },
  "Match details": { fr: "Details du match", ar: "تفاصيل المباراة" },
  "Notify me": { fr: "Me notifier", ar: "نبهني" },
  "Booking open": { fr: "Reservation ouverte", ar: "الحجز مفتوح" },
  "Booking opens": { fr: "Ouverture reservation", ar: "يفتح الحجز" },
  Spots: { fr: "Places", ar: "الأماكن" },
  "Not paid": { fr: "Non paye", ar: "غير مدفوع" },
  Total: { fr: "Total", ar: "المجموع" },
  "Match report": { fr: "Rapport match", ar: "تقرير المباراة" },
  "Current balance": { fr: "Solde actuel", ar: "الرصيد الحالي" },
  "View profile": { fr: "Voir profil", ar: "عرض الملف" },
  "Not set": { fr: "Non defini", ar: "غير محدد" },
  "Game rule": { fr: "Regle du match", ar: "قاعدة المباراة" },
  "10 players • 2 teams": { fr: "10 joueurs • 2 equipes", ar: "10 لاعبين • فريقان" },
  "Fair play": { fr: "Fair-play", ar: "اللعب النظيف" },
  "Respect and commitment": { fr: "Respect et engagement", ar: "احترام والتزام" },
  "Be on time": { fr: "A l'heure", ar: "كن في الموعد" },
  "Arrive 15 min before kick-off": { fr: "Arrive 15 min avant", ar: "احضر قبل 15 دقيقة" },
  "Have fun": { fr: "Amuse-toi", ar: "استمتع" },
  "We play for friendship": { fr: "On joue pour l'amitie", ar: "نلعب من أجل الصداقة" },
  Analytics: { fr: "Analytique", ar: "التحليلات" },
  Games: { fr: "Matchs", ar: "المباريات" },
  Players: { fr: "Joueurs", ar: "اللاعبون" },
  "Players Details": { fr: "Details joueurs", ar: "تفاصيل اللاعبين" },
  Teams: { fr: "Equipes", ar: "الفرق" },
  Bookings: { fr: "Reservations", ar: "الحجوزات" },
  Schedule: { fr: "Schedule", ar: "الجدول" },
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
  },
  "Next game, attendance, highlights, and upcoming reservations.": {
    fr: "Prochain match, presence, moments importants et reservations a venir.",
    ar: "المباراة القادمة، الحضور، أبرز النقاط، والحجوزات القادمة."
  },
  "KoraSmart Home": { fr: "Accueil KoraSmart", ar: "رئيسية KoraSmart" },
  "Next game, attendance, and club rhythm.": {
    fr: "Prochain match, presence et rythme du groupe.",
    ar: "المباراة القادمة، الحضور، وإيقاع المجموعة."
  },
  "This is the simple member view: check the next reservation, put your name down, see who is confirmed, and follow the upcoming games.": {
    fr: "Vue simple pour les membres : consultez la prochaine reservation, confirmez votre presence, voyez les joueurs confirmes et suivez les matchs a venir.",
    ar: "واجهة بسيطة للأعضاء: راجع الحجز القادم، أكد حضورك، شاهد اللاعبين المؤكدين، وتابع المباريات القادمة."
  },
  "Player ratings": { fr: "Notes joueurs", ar: "تقييم اللاعبين" },
  "Full schedule": { fr: "Planning complet", ar: "الجدول الكامل" },
  "Incoming game details": { fr: "Details du prochain match", ar: "تفاصيل المباراة القادمة" },
  "No upcoming game has been scheduled yet.": {
    fr: "Aucun match a venir n'est encore planifie.",
    ar: "لم يتم تحديد أي مباراة قادمة بعد."
  },
  "Confirmed spots": { fr: "Places confirmees", ar: "الأماكن المؤكدة" },
  "First come, first served": { fr: "Premier inscrit, premier servi", ar: "الأولوية حسب ترتيب التسجيل" },
  "Promotes automatically": { fr: "Monte automatiquement", ar: "الترقية تلقائية" },
  Members: { fr: "Membres", ar: "الأعضاء" },
  "Registered group list": { fr: "Liste du groupe inscrit", ar: "قائمة المجموعة المسجلة" },
  "Fair teams": { fr: "Equipes equilibrees", ar: "فرق عادلة" },
  Ratings: { fr: "Notes", ar: "التقييمات" },
  "Anonymous peer scores": { fr: "Notes anonymes entre joueurs", ar: "تقييمات مجهولة بين اللاعبين" },
  "Attendance List": { fr: "Liste de presence", ar: "قائمة الحضور" },
  "Confirmed players": { fr: "Joueurs confirmes", ar: "اللاعبون المؤكدون" },
  "Quick Info": { fr: "Infos rapides", ar: "معلومات سريعة" },
  "Match stats are entered after the game from Players Details.": {
    fr: "Les statistiques du match sont saisies apres le match depuis Details joueurs.",
    ar: "يتم إدخال إحصائيات المباراة بعد انتهائها من تفاصيل اللاعبين."
  },
  "Player ratings stay anonymous and feed future fair teams.": {
    fr: "Les notes restent anonymes et aident a former des equipes equilibrees.",
    ar: "تبقى تقييمات اللاعبين مجهولة وتساعد على تكوين فرق عادلة لاحقا."
  },
  "First 10 members who choose attending are confirmed. Later signups join the waiting list automatically. No response means not attending.": {
    fr: "Les 10 premiers membres qui confirment leur presence jouent. Les suivants passent automatiquement en liste d'attente. Sans reponse, le joueur est considere absent.",
    ar: "أول 10 أعضاء يؤكدون الحضور يتم تثبيتهم. التسجيلات اللاحقة تنتقل تلقائيا إلى قائمة الانتظار. عدم الرد يعني عدم الحضور."
  },
  Attending: { fr: "Present", ar: "حاضر" },
  "Not attending": { fr: "Absent", ar: "غير حاضر" },
  "Drop out": { fr: "Me retirer", ar: "انسحاب" },
  "Not attending by default until you choose attending.": {
    fr: "Absent par defaut jusqu'a confirmation de votre presence.",
    ar: "تعتبر غير حاضر افتراضيا حتى تؤكد الحضور."
  },
  "Controlled by your logged-in profile.": {
    fr: "Controle par votre profil connecte.",
    ar: "يتم التحكم به من خلال ملفك المتصل."
  },
  "Player profile": { fr: "Profil joueur", ar: "ملف اللاعب" },
  "Local login for this prototype. Later this becomes your real account.": {
    fr: "Connexion locale pour ce prototype. Plus tard, ce sera votre vrai compte.",
    ar: "تسجيل دخول محلي لهذا النموذج. لاحقا سيصبح حسابك الحقيقي."
  },
  "Logged in": { fr: "Connecte", ar: "متصل" },
  "Logged out": { fr: "Deconnecte", ar: "غير متصل" },
  "Local profile": { fr: "Profil local", ar: "ملف محلي" },
  "Tap to login": { fr: "Cliquer pour se connecter", ar: "اضغط لتسجيل الدخول" },
  "Upload avatar": { fr: "Importer une photo", ar: "رفع صورة" },
  "Choose avatar": { fr: "Choisir un avatar", ar: "اختر صورة رمزية" },
  "Soccer avatar": { fr: "Avatar football", ar: "صورة كرة قدم" },
  "Display name": { fr: "Nom affiche", ar: "اسم العرض" },
  "Assigned to this login. Only your avatar and display name can be changed here.": {
    fr: "Associe a cette connexion. Ici, vous pouvez seulement changer votre avatar et votre nom affiche.",
    ar: "مرتبط بتسجيل الدخول هذا. هنا يمكنك تغيير صورتك واسم العرض فقط."
  },
  "Assigned to this login.": {
    fr: "Associe a cette connexion.",
    ar: "مرتبط بهذا الحساب."
  },
  Username: { fr: "Nom d'utilisateur", ar: "اسم المستخدم" },
  Password: { fr: "Mot de passe", ar: "كلمة المرور" },
  "New password": { fr: "Nouveau mot de passe", ar: "كلمة مرور جديدة" },
  "Confirm password": { fr: "Confirmer mot de passe", ar: "تأكيد كلمة المرور" },
  "Change password": { fr: "Changer mot de passe", ar: "تغيير كلمة المرور" },
  "Save password": { fr: "Enregistrer mot de passe", ar: "حفظ كلمة المرور" },
  "Set Your Password": { fr: "Definis ton mot de passe", ar: "حدد كلمة المرور" },
  "Password updated.": { fr: "Mot de passe mis a jour.", ar: "تم تحديث كلمة المرور." },
  "Password could not be changed.": {
    fr: "Le mot de passe n'a pas pu etre change.",
    ar: "تعذر تغيير كلمة المرور."
  },
  "Password must be at least 8 characters.": {
    fr: "Le mot de passe doit contenir au moins 8 caracteres.",
    ar: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."
  },
  "Passwords do not match.": {
    fr: "Les mots de passe ne correspondent pas.",
    ar: "كلمتا المرور غير متطابقتين."
  },
  "Invalid username or password.": {
    fr: "Nom d'utilisateur ou mot de passe incorrect.",
    ar: "اسم المستخدم أو كلمة المرور غير صحيح."
  },
  "Prototype login: username is the player name without spaces, password is kora2026.": {
    fr: "Connexion prototype : le nom d'utilisateur est le nom du joueur sans espaces, le mot de passe est kora2026.",
    ar: "تسجيل دخول تجريبي: اسم المستخدم هو اسم اللاعب بدون فراغات، وكلمة المرور هي kora2026."
  },
  "Enter your KoraSmart username and password.": {
    fr: "Entre ton nom d'utilisateur et ton mot de passe KoraSmart.",
    ar: "أدخل اسم مستخدم وكلمة مرور KoraSmart."
  },
  "Use your player username and password to enter KoraSmart.": {
    fr: "Utilise ton identifiant joueur et ton mot de passe pour entrer dans KoraSmart.",
    ar: "استخدم اسم المستخدم وكلمة المرور للدخول إلى KoraSmart."
  },
  "Welcome back. Choose a private password before entering KoraSmart.": {
    fr: "Bon retour. Choisis un mot de passe prive avant d'entrer dans KoraSmart.",
    ar: "مرحبا بعودتك. اختر كلمة مرور خاصة قبل الدخول إلى KoraSmart."
  },
  Cancel: { fr: "Annuler", ar: "إلغاء" },
  Logout: { fr: "Deconnexion", ar: "تسجيل الخروج" },
  Login: { fr: "Connexion", ar: "تسجيل الدخول" },
  Done: { fr: "Terminer", ar: "تم" },
  "Attendance uses this logged-in player automatically. For real deployment, this will be protected by username and password.": {
    fr: "La presence utilise automatiquement ce joueur connecte. Au deploiement, ce sera protege par nom d'utilisateur et mot de passe.",
    ar: "يستخدم الحضور هذا اللاعب المتصل تلقائيا. عند النشر الحقيقي، سيكون محميا باسم مستخدم وكلمة مرور."
  },
  "Attendance uses this profile automatically.": {
    fr: "La presence utilise automatiquement ce profil.",
    ar: "يستخدم الحضور هذا الملف تلقائيا."
  },
  Notifications: { fr: "Notifications", ar: "الإشعارات" },
  "Live from schedule and attendance.": {
    fr: "Mises a jour depuis le planning et la presence.",
    ar: "تحديثات مباشرة من الجدولة والحضور."
  },
  "Nothing new right now.": { fr: "Rien de nouveau pour le moment.", ar: "لا جديد حاليا." },
  "Enable browser notifications on this device": {
    fr: "Activer les notifications du navigateur sur cet appareil",
    ar: "تفعيل إشعارات المتصفح على هذا الجهاز"
  },
  "No notifications yet.": { fr: "Aucune notification pour le moment.", ar: "لا توجد إشعارات بعد." },
  "Next game scheduled": { fr: "Prochain match planifie", ar: "تمت جدولة المباراة القادمة" },
  "Attendance is open": { fr: "Presence ouverte", ar: "تم فتح الحضور" },
  "Choose attending to reserve your place. No response means not attending.": {
    fr: "Choisissez Present pour reserver votre place. Sans reponse, vous etes considere absent.",
    ar: "اختر حاضر لحجز مكانك. عدم الرد يعني عدم الحضور."
  },
  "You are confirmed": { fr: "Vous etes confirme", ar: "تم تأكيدك" },
  "You are on the waiting list": { fr: "Vous etes en liste d'attente", ar: "أنت في قائمة الانتظار" },
  Empty: { fr: "Vide", ar: "فارغ" },
  "No official game entered": { fr: "Aucun match officiel saisi", ar: "لم يتم إدخال أي مباراة رسمية" },
  "Organize. Confirm. Play.": { fr: "Organisez. Confirmez. Jouez.", ar: "نظم. أكد. العب." },
  "Active roster": { fr: "Effectif actif", ar: "القائمة النشطة" },
  "Scheduled games": { fr: "Matchs programmes", ar: "المباريات المجدولة" },
  "Current caisse": { fr: "Caisse actuelle", ar: "الصندوق الحالي" },
  "After match": { fr: "Apres match", ar: "بعد المباراة" },
  "Choose your status.": { fr: "Choisis ton statut.", ar: "اختر حالتك." },
  Waitlist: { fr: "Attente", ar: "انتظار" },
  "Budget Officer Workspace": { fr: "Espace budget", ar: "مساحة الميزانية" },
  "Booking Costs": { fr: "Frais de reservation", ar: "تكاليف الحجز" },
  "Each new reservation records an 80 MAD/DH cost once. Deleted bookings add a reversal.": {
    fr: "Chaque reservation ajoute une fois 80 MAD/DH. Une suppression ajoute une annulation.",
    ar: "كل حجز جديد يسجل تكلفة 80 درهم مرة واحدة. حذف الحجز يسجل عكسا."
  },
  "Booking transactions:": { fr: "Transactions reservation :", ar: "معاملات الحجز:" },
  "Game stats": { fr: "Stats match", ar: "إحصائيات المباراة" },
  Ready: { fr: "Pret", ar: "جاهز" },
  "View finances": { fr: "Voir finances", ar: "عرض المالية" },
  "New reservation": { fr: "Nouvelle reservation", ar: "حجز جديد" },
  "Manage members": { fr: "Gerer membres", ar: "إدارة الأعضاء" },
  "Analytics report": { fr: "Rapport analytique", ar: "تقرير التحليلات" },
  Open: { fr: "Ouvert", ar: "مفتوح" },
  Locked: { fr: "Ferme", ar: "مغلق" },
  Closed: { fr: "Ferme", ar: "مغلق" }
  ,
  Chat: { fr: "Chat", ar: "الدردشة" },
  Money: { fr: "Caisse", ar: "المال" },
  Dates: { fr: "Dates", ar: "المواعيد" },
  "Team messages inside KoraSmart.": {
    fr: "Messages d'equipe dans KoraSmart.",
    ar: "رسائل الفريق داخل KoraSmart."
  },
  "Team Chat": { fr: "Chat d'equipe", ar: "دردشة الفريق" },
  "Messages from logged-in players.": {
    fr: "Messages des joueurs connectes.",
    ar: "رسائل اللاعبين المتصلين."
  },
  messages: { fr: "messages", ar: "رسائل" },
  Delete: { fr: "Supprimer", ar: "حذف" },
  Send: { fr: "Envoyer", ar: "إرسال" },
  "No messages yet.": { fr: "Aucun message pour le moment.", ar: "لا توجد رسائل بعد." },
  "Start the first team conversation.": {
    fr: "Lancez la premiere conversation du groupe.",
    ar: "ابدأ أول محادثة للفريق."
  },
  "Write a message": { fr: "Ecrire un message", ar: "اكتب رسالة" },
  "Chat Access": { fr: "Acces chat", ar: "صلاحية الدردشة" },
  "Only your logged-in profile can post here.": {
    fr: "Seul votre profil connecte peut publier ici.",
    ar: "يمكن لملفك المتصل فقط النشر هنا."
  },
  "You can delete your own messages.": {
    fr: "Vous pouvez supprimer vos propres messages.",
    ar: "يمكنك حذف رسائلك فقط."
  },
  "For deployment, this will become realtime chat with protected accounts.": {
    fr: "Au deploiement, ce sera un chat en temps reel avec des comptes proteges.",
    ar: "عند النشر، ستصبح دردشة فورية بحسابات محمية."
  },
  "Team chat": { fr: "Chat d'equipe", ar: "دردشة الفريق" },
  "Open chat": { fr: "Ouvrir chat", ar: "فتح الدردشة" },
  Close: { fr: "Fermer", ar: "إغلاق" },
  "Private or group messages": {
    fr: "Messages prives ou en groupe",
    ar: "رسائل خاصة أو جماعية"
  },
  "Direct messages": { fr: "Messages directs", ar: "رسائل مباشرة" },
  "New group": { fr: "Nouveau groupe", ar: "مجموعة جديدة" },
  Group: { fr: "Groupe", ar: "مجموعة" },
  "Open group chat": { fr: "Ouvrir le groupe", ar: "فتح دردشة المجموعة" },
  "All members": { fr: "Tous les membres", ar: "كل الأعضاء" },
  Online: { fr: "En ligne", ar: "متصل" },
  Offline: { fr: "Hors ligne", ar: "غير متصل" },
  "Past Games": { fr: "Matchs passes", ar: "المباريات السابقة" },
  "Game Statistics": { fr: "Statistiques des matchs", ar: "إحصائيات المباريات" },
  "Match reports, team sheets, scores, and scorers.": {
    fr: "Rapports de match, compositions, scores et buteurs.",
    ar: "تقارير المباريات، التشكيلات، النتائج، والهدافون."
  },
  "Structured match reports, team compositions, scores, and scorers.": {
    fr: "Rapports structures, compositions, scores et buteurs.",
    ar: "تقارير منظمة، تشكيلات الفرق، النتائج، والهدافون."
  },
  "Submit structured match reports after each game. Player selections and scorer counts will feed analytics later.": {
    fr: "Soumettez des rapports structures apres chaque match. Les selections de joueurs et les buts alimenteront les analyses plus tard.",
    ar: "أرسل تقارير منظمة بعد كل مباراة. اختيارات اللاعبين وعدد الأهداف ستغذي التحليلات لاحقا."
  },
  "Fluorescent team": { fr: "Equipe fluo", ar: "الفريق الفوسفوري" },
  "Orange team": { fr: "Equipe orange", ar: "الفريق البرتقالي" },
  "goals recorded": { fr: "buts enregistres", ar: "أهداف مسجلة" },
  "Submit match report": { fr: "Soumettre le rapport", ar: "إرسال تقرير المباراة" },
  "Finished reservations move here automatically after their date and time pass. Update team compositions, score, winner, scorers, and notes.": {
    fr: "Les reservations terminees arrivent ici automatiquement apres leur date et heure. Mettez a jour les compositions, le score, le gagnant, les buteurs et les notes.",
    ar: "تنتقل الحجوزات المنتهية هنا تلقائيا بعد مرور التاريخ والوقت. حدّث التشكيلات، النتيجة، الفريق الفائز، الهدافين، والملاحظات."
  },
  games: { fr: "matchs", ar: "مباريات" },
  "Past game": { fr: "Match passe", ar: "مباراة سابقة" },
  "Fluorescent team composition": { fr: "Composition equipe fluo", ar: "تشكيلة الفريق الفوسفوري" },
  "Orange team composition": { fr: "Composition equipe orange", ar: "تشكيلة الفريق البرتقالي" },
  "Winning team": { fr: "Equipe gagnante", ar: "الفريق الفائز" },
  Draw: { fr: "Egalite", ar: "تعادل" },
  Fluorescent: { fr: "Fluo", ar: "الفوسفوري" },
  Orange: { fr: "Orange", ar: "البرتقالي" },
  Scorers: { fr: "Buteurs", ar: "الهدافون" },
  Notes: { fr: "Notes", ar: "ملاحظات" },
  "No past games yet.": { fr: "Aucun match passe pour le moment.", ar: "لا توجد مباريات سابقة بعد." },
  "min football reservation": { fr: "min de reservation football", ar: "دقيقة حجز كرة قدم" },
  attending: { fr: "presents", ar: "حاضرون" },
  waiting: { fr: "en attente", ar: "في الانتظار" },
  "Use Drop out if something comes up.": {
    fr: "Utilisez Me retirer en cas d'empechement.",
    ar: "استخدم انسحاب إذا حدث مانع."
  },
  "You move up automatically if someone drops out.": {
    fr: "Vous montez automatiquement si quelqu'un se retire.",
    ar: "تتقدم تلقائيا إذا انسحب أحد اللاعبين."
  },
  spot: { fr: "place", ar: "مكان" },
  position: { fr: "position", ar: "الترتيب" },
  Superuser: { fr: "Superutilisateur", ar: "مستخدم فائق" },
  Player: { fr: "Joueur", ar: "لاعب" },
  "Budgeting & Booking officer": { fr: "Responsable budget et reservations", ar: "مسؤول الميزانية والحجوزات" },
  "Access Control": { fr: "Controle des acces", ar: "إدارة الصلاحيات" },
  "Superuser access is required to manage roles and impersonation.": {
    fr: "Un acces superutilisateur est requis pour gerer les roles et l'impersonation.",
    ar: "صلاحية المستخدم الفائق مطلوبة لإدارة الأدوار والانتحال."
  },
  "Najib is Superuser by default. Nawfal is Admin by default.": {
    fr: "Najib est superutilisateur par defaut. Nawfal est admin par defaut.",
    ar: "نجيب مستخدم فائق افتراضيا. نوفل Admin افتراضيا."
  },
  "Reset defaults": { fr: "Retablir par defaut", ar: "استعادة الافتراضي" },
  "Full access, role changes, and impersonation.": {
    fr: "Acces complet, changement des roles et impersonation.",
    ar: "وصول كامل وتغيير الأدوار والانتحال."
  },
  "Bookings, finances, and player management.": {
    fr: "Reservations, finances et gestion des joueurs.",
    ar: "الحجوزات والمالية وإدارة اللاعبين."
  },
  "Bookings and contribution updates.": {
    fr: "Reservations et mises a jour des cotisations.",
    ar: "الحجوزات وتحديث المساهمات."
  },
  "Player view, attendance, and personal status.": {
    fr: "Vue joueur, presence et statut personnel.",
    ar: "عرض اللاعب والحضور والحالة الشخصية."
  },
  "Role changes are applied immediately to the local profile system.": {
    fr: "Les changements de role sont appliques immediatement au profil local.",
    ar: "يتم تطبيق تغييرات الأدوار فورا على نظام الملف المحلي."
  },
  "Permission Matrix": { fr: "Matrice des permissions", ar: "جدول الصلاحيات" },
  "Change user access": { fr: "Changer l'acces utilisateur", ar: "تغيير صلاحية المستخدم" },
  "Impersonate another user": { fr: "Impersoner un autre utilisateur", ar: "انتحال مستخدم آخر" },
  "All roles": { fr: "Tous les roles", ar: "كل الأدوار" },
  "Superuser, Admin, Officer": { fr: "Superutilisateur, Admin, Responsable", ar: "مستخدم فائق، Admin، مسؤول" },
  "Superuser, Admin": { fr: "Superutilisateur, Admin", ar: "مستخدم فائق، Admin" },
  "Admin or Superuser access is required to add or remove players.": {
    fr: "Un acces Admin ou Superutilisateur est requis pour ajouter ou retirer des joueurs.",
    ar: "صلاحية Admin أو مستخدم فائق مطلوبة لإضافة أو حذف اللاعبين."
  },
  "Superuser, Admin, or Officer access is required to update game statistics.": {
    fr: "Un acces Superutilisateur, Admin ou Responsable est requis pour modifier les statistiques.",
    ar: "صلاحية مستخدم فائق أو Admin أو مسؤول مطلوبة لتحديث الإحصائيات."
  },
  "Passing accuracy": { fr: "Precision des passes", ar: "دقة التمرير" },
  "One-time 0-10 decimal ratings help balance teams.": {
    fr: "Des notes decimales uniques de 0 a 10 aident a equilibrer les equipes.",
    ar: "تقييمات عشرية لمرة واحدة من 0 إلى 10 تساعد على توازن الفرق."
  },
  "Pick a player, enter precise skill scores, then save once.": {
    fr: "Choisissez un joueur, saisissez les notes precises, puis enregistrez une seule fois.",
    ar: "اختر لاعبا، أدخل تقييمات دقيقة، ثم احفظ مرة واحدة."
  },
  "Reset this player": { fr: "Reinitialiser ce joueur", ar: "إعادة ضبط هذا اللاعب" },
  "Rating locked for": { fr: "Note verrouillee pour", ar: "التقييم مقفل لـ" },
  "A Superuser can reset this player to allow a new rating.": {
    fr: "Un superutilisateur peut reinitialiser ce joueur pour permettre une nouvelle note.",
    ar: "يمكن للمستخدم الفائق إعادة ضبط هذا اللاعب للسماح بتقييم جديد."
  },
  "No rating saved yet for this player.": {
    fr: "Aucune note enregistree pour ce joueur.",
    ar: "لا يوجد تقييم محفوظ لهذا اللاعب بعد."
  },
  "Rating saved": { fr: "Note enregistree", ar: "تم حفظ التقييم" },
  votes: { fr: "votes", ar: "تصويتات" },
  "Save rating": { fr: "Enregistrer la note", ar: "حفظ التقييم" },
  "Attendance open": { fr: "Presence ouverte", ar: "الحضور مفتوح" },
  "Are you playing this match?": { fr: "Tu joues ce match ?", ar: "هل ستلعب هذه المباراة؟" },
  "Join waiting list": { fr: "Rejoindre l'attente", ar: "انضم لقائمة الانتظار" },
  "as player": { fr: "comme joueur", ar: "كلاعب" },
  "Choose one option now so the group can plan teams clearly.": {
    fr: "Choisis une option maintenant pour aider le groupe a organiser les equipes.",
    ar: "اختر خيارا الآن حتى يتمكن الفريق من تنظيم الفرق بوضوح."
  },
  "Live attendance": { fr: "Presence en direct", ar: "الحضور المباشر" },
  "Saving...": { fr: "Enregistrement...", ar: "جار الحفظ..." },
  Saving: { fr: "Enregistrement", ar: "جار الحفظ" },
  Saved: { fr: "Enregistre", ar: "تم الحفظ" },
  "Saved. Your status is synced.": {
    fr: "Enregistre. Ton statut est synchronise.",
    ar: "تم الحفظ. تمت مزامنة حالتك."
  },
  "Your status is synced.": {
    fr: "Ton statut est synchronise.",
    ar: "تمت مزامنة حالتك."
  },
  "Admin tool": { fr: "Outil admin", ar: "أداة الإدارة" },
  "Network check": { fr: "Verification reseau", ar: "فحص الشبكة" },
  "Superuser access is required for this diagnostic page.": {
    fr: "Un acces superutilisateur est requis pour cette page de diagnostic.",
    ar: "هذه الصفحة التشخيصية تتطلب صلاحية المستخدم الفائق."
  },
  "Install app": { fr: "Installer l'app", ar: "تثبيت التطبيق" },
  Install: { fr: "Installer", ar: "تثبيت" },
  "Download app": { fr: "Telecharger l'app", ar: "تحميل التطبيق" },
  "Install KoraSmart": { fr: "Installer KoraSmart", ar: "تثبيت KoraSmart" },
  "On iPhone, open this site in Safari.": {
    fr: "Sur iPhone, ouvrez ce site dans Safari.",
    ar: "على iPhone، افتح هذا الموقع في Safari."
  },
  "Tap Share, then Add to Home Screen.": {
    fr: "Touchez Partager, puis Ajouter a l'ecran d'accueil.",
    ar: "اضغط مشاركة، ثم إضافة إلى الشاشة الرئيسية."
  },
  "Open your browser menu and choose Install app.": {
    fr: "Ouvrez le menu du navigateur et choisissez Installer l'app.",
    ar: "افتح قائمة المتصفح واختر تثبيت التطبيق."
  },
  "KoraSmart will appear on your home screen like a normal app.": {
    fr: "KoraSmart apparaitra sur votre ecran d'accueil comme une app normale.",
    ar: "سيظهر KoraSmart على الشاشة الرئيسية مثل تطبيق عادي."
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
