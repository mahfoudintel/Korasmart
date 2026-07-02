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
  Scheduling: { fr: "Schedule", ar: "الجدول" },
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
  "Invalid username or password.": {
    fr: "Nom d'utilisateur ou mot de passe incorrect.",
    ar: "اسم المستخدم أو كلمة المرور غير صحيح."
  },
  "Prototype login: username is the player name without spaces, password is kora2026.": {
    fr: "Connexion prototype : le nom d'utilisateur est le nom du joueur sans espaces, le mot de passe est kora2026.",
    ar: "تسجيل دخول تجريبي: اسم المستخدم هو اسم اللاعب بدون فراغات، وكلمة المرور هي kora2026."
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
  "No official game entered": { fr: "Aucun match officiel saisi", ar: "لم يتم إدخال أي مباراة رسمية" }
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
  position: { fr: "position", ar: "الترتيب" }
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
