const TRACK_LEVEL_LABELS = {
  beginner: {
    en: "Beginner", ar: "مبتدئ", ary: "Mobtadi", fr: "Débutant",
    es: "Principiante", pt: "Iniciante", it: "Principiante", de: "Anfänger"
  },
  intermediate: {
    en: "Intermediate", ar: "متوسط", ary: "Moutawassit", fr: "Intermédiaire",
    es: "Intermedio", pt: "Intermediário", it: "Intermedio", de: "Fortgeschritten"
  },
  advanced: {
    en: "Advanced", ar: "متقدم", ary: "Mota9addem", fr: "Avancé",
    es: "Avanzado", pt: "Avançado", it: "Avanzato", de: "Fortgeschritten"
  }
};

const UI_STRINGS = {
  appName: {
    en: "Masar", ar: "مسار", ary: "Masar", fr: "Masar",
    es: "Masar", pt: "Masar", it: "Masar", de: "Masar"
  },
  appTagline: {
    en: "Your personal skills shelf", ar: "رفّك الشخصي للمهارات", ary: "Raffek chakhsi dyal l-maharat",
    fr: "Votre étagère personnelle de compétences", es: "Tu estantería personal de habilidades",
    pt: "Sua estante pessoal de habilidades", it: "La tua libreria personale di competenze",
    de: "Dein persönliches Lernregal"
  },
  streakLabel: {
    en: "day streak", ar: "يوم متتالي", ary: "nhar mtetali",
    fr: "jours consécutifs", es: "días seguidos", pt: "dias seguidos", it: "giorni consecutivi", de: "Tage in Folge"
  },
  darkMode: {
    en: "Enable dark mode", ar: "تفعيل الوضع الداكن", ary: "F3al l-wad3 l-m3atem",
    fr: "Activer le mode sombre", es: "Activar modo oscuro", pt: "Ativar modo escuro",
    it: "Attiva modalità scura", de: "Dunkelmodus aktivieren"
  },
  lightMode: {
    en: "Enable light mode", ar: "تفعيل الوضع الفاتح", ary: "F3al l-wad3 l-mnowwer",
    fr: "Activer le mode clair", es: "Activar modo claro", pt: "Ativar modo claro",
    it: "Attiva modalità chiara", de: "Hellmodus aktivieren"
  },
  categories: {
    en: "Categories", ar: "الفئات", ary: "l-f2at", fr: "Catégories", es: "Categorías",
    pt: "Categorias", it: "Categorie", de: "Kategorien"
  },
  language: {
    en: "Language", ar: "اللغة", ary: "Lougha", fr: "Langue",
    es: "Idioma", pt: "Idioma", it: "Lingua", de: "Sprache"
  },
  today: {
    en: "Today", ar: "اليوم", ary: "Lyouma", fr: "Aujourd’hui", es: "Hoy",
    pt: "Hoje", it: "Oggi", de: "Heute"
  },
  startTitle: {
    en: "Start your first book", ar: "ابدأ أول كتاب في مكتبتك", ary: "Bda awal kteb f mktbtek",
    fr: "Commencez votre premier livre", es: "Empieza tu primer libro",
    pt: "Comece seu primeiro livro", it: "Inizia il tuo primo libro", de: "Starte dein erstes Buch"
  },
  continueTitle: {
    en: 'Continue "{title}"', ar: 'أكمل "{title}"', ary: 'Kmml "{title}"',
    fr: 'Continuez "{title}"', es: 'Continúa "{title}"', pt: 'Continue "{title}"',
    it: 'Continua "{title}"', de: 'Setze "{title}" fort'
  },
  continueDesc: {
    en: "You completed {done} of {total} pages. One more page brings you closer.",
    ar: "أنجزت {done} من {total} صفحة. صفحة أخرى وتقترب من الإنجاز.",
    ary: "Kmmlti {done} mn {total} saf7at. Saf7a khra w tqreb tkmml.",
    fr: "Vous avez terminé {done} pages sur {total}. Encore une page !",
    es: "Has completado {done} de {total} páginas. ¡Una más para acercarte!",
    pt: "Você concluiu {done} de {total} páginas. Mais uma e estará mais perto.",
    it: "Hai completato {done} pagine su {total}. Ancora una per avvicinarti.",
    de: "Du hast {done} von {total} Seiten geschafft. Eine weitere bringt dich näher."
  },
  tryTitle: {
    en: 'Try "{title}" or browse the shelves to choose another skill.',
    ar: 'جرّب "{title}" أو تصفّح الأرفف لاختيار مهارة أخرى.',
    ary: 'Jreb "{title}" wla dour f rrofouf bach tkhtar maharat khra.',
    fr: 'Essayez "{title}" ou parcourez les étagères pour choisir une compétence.',
    es: 'Prueba "{title}" o explora las estanterías para elegir otra habilidad.',
    pt: 'Experimente "{title}" ou explore as estantes para escolher outra habilidade.',
    it: 'Prova "{title}" o esplora gli scaffali per scegliere un’altra competenza.',
    de: 'Probiere "{title}" oder stöbere nach einer anderen Fähigkeit.'
  },
  browseShelves: {
    en: "Browse shelves", ar: "تصفّح الأرفف", ary: "Dour f rrofouf", fr: "Parcourir les étagères",
    es: "Explorar estanterías", pt: "Explorar estantes", it: "Sfoglia scaffali", de: "Regale durchsuchen"
  },
  startNow: {
    en: "Start now", ar: "ابدأ الآن", ary: "Bda daba", fr: "Commencer", es: "Empezar",
    pt: "Começar", it: "Inizia", de: "Jetzt starten"
  },
  continueReading: {
    en: "Continue reading", ar: "متابعة القراءة", ary: "Kmmel l9raya", fr: "Continuer la lecture",
    es: "Continuar leyendo", pt: "Continuar lendo", it: "Continua a leggere", de: "Weiterlesen"
  },
  statCompletedLabel: {
    en: "Pages completed", ar: "صفحة أُنجزت", ary: "saf7at kmelti", fr: "Pages terminées",
    es: "Páginas completadas", pt: "Páginas concluídas", it: "Pagine completate", de: "Abgeschlossene Seiten"
  },
  statBooksLabel: {
    en: "Books in progress", ar: "كتاب قيد القراءة", ary: "ktoba li katqra", fr: "Livres en cours",
    es: "Libros en curso", pt: "Livros em andamento", it: "Libri in corso", de: "Bücher in Bearbeitung"
  },
  statFinishedLabel: {
    en: "Books completed", ar: "كتاب مكتمل", ary: "ktoba kmelti", fr: "Livres terminés",
    es: "Libros terminados", pt: "Livros concluídos", it: "Libri completati", de: "Abgeschlossene Bücher"
  },
  allShelves: {
    en: "All shelves", ar: "كل الأرفف", ary: "Ga3 rrofouf", fr: "Toutes les étagères",
    es: "Todas las estanterías", pt: "Todas as estantes", it: "Tutti gli scaffali", de: "Alle Regale"
  },
  booksCount: {
    en: "{count} books", ar: "{count} كتب", ary: "{count} ktoba", fr: "{count} livres",
    es: "{count} libros", pt: "{count} livros", it: "{count} libri", de: "{count} Bücher"
  },
  searchPlaceholder: {
    en: "Search for a skill...", ar: "ابحث عن مهارة...", ary: "Qelleb 3la maharat...",
    fr: "Rechercher une compétence...", es: "Buscar una habilidad...",
    pt: "Buscar uma habilidade...", it: "Cerca una competenza...", de: "Nach einer Fähigkeit suchen..."
  },
  noResults: {
    en: "No matching results", ar: "لا توجد نتائج مطابقة", ary: "Ma kaynach nata2ej mtab9a",
    fr: "Aucun résultat correspondant", es: "No hay resultados coincidentes",
    pt: "Nenhum resultado correspondente", it: "Nessun risultato corrispondente", de: "Keine passenden Ergebnisse"
  },
  backToShelf: {
    en: "→ Back to shelf", ar: "→ عودة للرف", ary: "-> Rje3 l-rref",
    fr: "→ Retour à l’étagère", es: "→ Volver a la estantería", pt: "→ Voltar à estante",
    it: "→ Torna allo scaffale", de: "→ Zurück zum Regal"
  },
  resetProgress: {
    en: "Reset progress", ar: "إعادة ضبط التقدم", ary: "3awed sefer tta9addom",
    fr: "Réinitialiser la progression", es: "Restablecer progreso", pt: "Redefinir progresso",
    it: "Azzera progresso", de: "Fortschritt zurücksetzen"
  },
  resetConfirm: {
    en: "Reset this book's progress?", ar: "هل تريد إعادة ضبط تقدم هذا الكتاب؟", ary: "Bghiti t3awed sefer tta9addom dyal had l-kteb?",
    fr: "Réinitialiser la progression de ce livre ?", es: "¿Restablecer el progreso de este libro?",
    pt: "Redefinir o progresso deste livro?", it: "Azzerare i progressi di questo libro?",
    de: "Fortschritt dieses Buchs zurücksetzen?"
  },
  pageCount: {
    en: "{done}/{total} pages", ar: "{done}/{total} صفحة", ary: "{done}/{total} saf7at",
    fr: "{done}/{total} pages", es: "{done}/{total} páginas", pt: "{done}/{total} páginas",
    it: "{done}/{total} pagine", de: "{done}/{total} Seiten"
  },
  progressText: {
    en: "{done} of {total} pages completed ({pct}%)", ar: "{done} من {total} صفحة مكتملة ({pct}%)",
    ary: "{done} mn {total} saf7at kmelti ({pct}%)", fr: "{done} pages sur {total} terminées ({pct}%)",
    es: "{done} de {total} páginas completadas ({pct}%)", pt: "{done} de {total} páginas concluídas ({pct}%)",
    it: "{done} pagine su {total} completate ({pct}%)", de: "{done} von {total} Seiten abgeschlossen ({pct}%)"
  },
  lessonDone: {
    en: "Mark lesson complete", ar: "إتمام الدرس", ary: "Kmmel dars", fr: "Marquer la leçon comme terminée",
    es: "Marcar lección como completada", pt: "Marcar lição como concluída",
    it: "Segna lezione come completata", de: "Lektion als erledigt markieren"
  },
  lessonUndone: {
    en: "Undo lesson completion", ar: "إلغاء إتمام الدرس", ary: "Lghi kmal dars",
    fr: "Annuler la leçon terminée", es: "Deshacer lección completada", pt: "Desfazer conclusão da lição",
    it: "Annulla completamento lezione", de: "Lektion als unerledigt markieren"
  },
  lessonDoneToast: {
    en: "Page completed! Your streak is now {count} days 🔥", ar: "أُنجزت الصفحة! سلسلتك الآن {count} يوم 🔥",
    ary: "Saf7a kmelat! l-mosalsal dyalek daba {count} nhar 🔥",
    fr: "Page terminée ! Votre série est maintenant de {count} jours 🔥",
    es: "¡Página completada! Tu racha es de {count} días 🔥",
    pt: "Página concluída! Sua sequência agora é de {count} dias 🔥",
    it: "Pagina completata! La tua serie è ora di {count} giorni 🔥",
    de: "Seite abgeschlossen! Deine Serie beträgt jetzt {count} Tage 🔥"
  },
  saveError: {
    en: "Could not save progress. Check your browser settings.",
    ar: "تعذّر حفظ التقدم، تحقق من إعدادات المتصفح",
    ary: "Ma 9dernach nsajlo tta9addom, chouf i3dadat l-mowassih.",
    fr: "Impossible d’enregistrer la progression. Vérifiez les réglages du navigateur.",
    es: "No se pudo guardar el progreso. Revisa la configuración del navegador.",
    pt: "Não foi possível salvar o progresso. Verifique as configurações do navegador.",
    it: "Impossibile salvare i progressi. Controlla le impostazioni del browser.",
    de: "Fortschritt konnte nicht gespeichert werden. Prüfe deine Browsereinstellungen."
  },
  themeSaveError: {
    en: "Could not save theme preference. Check your browser settings.",
    ar: "تعذّر حفظ تفضيل المظهر، تحقق من إعدادات المتصفح",
    ary: "Ma 9dernach nsajlo tfdilat l-mod, chouf i3dadat l-mowassih.",
    fr: "Impossible d’enregistrer le thème. Vérifiez les réglages du navigateur.",
    es: "No se pudo guardar el tema. Revisa la configuración del navegador.",
    pt: "Não foi possível salvar o tema. Verifique as configurações do navegador.",
    it: "Impossibile salvare il tema. Controlla le impostazioni del browser.",
    de: "Design konnte nicht gespeichert werden. Prüfe deine Browsereinstellungen."
  },
  resetError: {
    en: "Could not reset progress. Check your browser settings.",
    ar: "تعذّر إعادة ضبط التقدم، تحقق من إعدادات المتصفح",
    ary: "Ma 9dernach nsefru tta9addom, chouf i3dadat l-mowassih.",
    fr: "Impossible de réinitialiser la progression. Vérifiez les réglages du navigateur.",
    es: "No se pudo restablecer el progreso. Revisa la configuración del navegador.",
    pt: "Não foi possível redefinir o progresso. Verifique as configurações do navegador.",
    it: "Impossibile azzerare i progressi. Controlla le impostazioni del browser.",
    de: "Fortschritt konnte nicht zurückgesetzt werden. Prüfe deine Browsereinstellungen."
  },
  noscriptMessage: {
    en: "Masar needs JavaScript enabled to work. Please enable it in your browser settings.",
    ar: "يحتاج تطبيق مسار إلى تفعيل JavaScript ليعمل. من فضلك فعّله في إعدادات متصفحك.",
    ary: "Masar khassha JavaScript mfa33el bach tkhdem. 3afak f3elha f i3dadat l-mowassih.",
    fr: "Masar a besoin de JavaScript pour fonctionner. Veuillez l'activer dans les réglages de votre navigateur.",
    es: "Masar necesita JavaScript activado para funcionar. Actívalo en la configuración de tu navegador.",
    pt: "O Masar precisa que o JavaScript esteja ativado para funcionar. Ative-o nas configurações do navegador.",
    it: "Masar richiede JavaScript attivo per funzionare. Attivalo nelle impostazioni del browser.",
    de: "Masar benötigt aktiviertes JavaScript, um zu funktionieren. Bitte aktiviere es in deinen Browsereinstellungen."
  },
  trackNotFoundTitle: {
    en: "This book isn't on the shelf", ar: "هذا الكتاب غير موجود على الرف", ary: "Had lkteb machi mawjoud f rref",
    fr: "Ce livre n'est pas sur l'étagère", es: "Este libro no está en la estantería", pt: "Este livro não está na estante",
    it: "Questo libro non è sullo scaffale", de: "Dieses Buch steht nicht im Regal"
  },
  trackNotFoundDesc: {
    en: "The link you followed may be outdated. Browse the shelves to find another skill.",
    ar: "قد يكون الرابط الذي اتبعته قديمًا. تصفّح الأرفف لتجد مهارة أخرى.",
    ary: "Yemkn l-link li tbe3ti 9dim. Dour f rrofouf bach tl9a maharat khra.",
    fr: "Le lien que vous avez suivi est peut-être obsolète. Parcourez les étagères pour trouver une autre compétence.",
    es: "El enlace que seguiste puede estar desactualizado. Explora las estanterías para encontrar otra habilidad.",
    pt: "O link que você seguiu pode estar desatualizado. Explore as estantes para encontrar outra habilidade.",
    it: "Il link seguito potrebbe non essere più valido. Sfoglia gli scaffali per trovare un'altra competenza.",
    de: "Der Link, dem du gefolgt bist, ist möglicherweise veraltet. Durchsuche die Regale nach einer anderen Fähigkeit."
  },
  exportProgress: {
    en: "Export progress", ar: "تصدير التقدم", ary: "Exporti tta9addom", fr: "Exporter la progression",
    es: "Exportar progreso", pt: "Exportar progresso", it: "Esporta progressi", de: "Fortschritt exportieren"
  },
  importProgress: {
    en: "Import progress", ar: "استيراد التقدم", ary: "Importi tta9addom", fr: "Importer la progression",
    es: "Importar progreso", pt: "Importar progresso", it: "Importa progressi", de: "Fortschritt importieren"
  },
  importSuccess: {
    en: "Progress imported successfully.", ar: "تم استيراد التقدم بنجاح.", ary: "Ttadi l-import dyal tta9addom b njah.",
    fr: "Progression importée avec succès.", es: "Progreso importado correctamente.", pt: "Progresso importado com sucesso.",
    it: "Progressi importati con successo.", de: "Fortschritt erfolgreich importiert."
  },
  importError: {
    en: "This file could not be read as a Masar backup.", ar: "تعذّرت قراءة هذا الملف كنسخة احتياطية من مسار.",
    ary: "Ma 9dernach n9raw had lfichier b7al backup dyal Masar.",
    fr: "Ce fichier n'a pas pu être lu comme une sauvegarde Masar.",
    es: "No se pudo leer este archivo como una copia de seguridad de Masar.",
    pt: "Não foi possível ler este arquivo como um backup do Masar.",
    it: "Impossibile leggere questo file come backup di Masar.",
    de: "Diese Datei konnte nicht als Masar-Sicherung gelesen werden."
  },
  searchLabel: {
    en: "Search for a skill", ar: "ابحث عن مهارة", ary: "Qelleb 3la maharat", fr: "Rechercher une compétence",
    es: "Buscar una habilidad", pt: "Buscar uma habilidade", it: "Cerca una competenza", de: "Nach einer Fähigkeit suchen"
  },
  skillToolsLabel: {
    en: "Tools and techniques", ar: "الأدوات والتقنيات", ary: "Lwasayel w ttiqniyat",
    fr: "Outils et techniques", es: "Herramientas y técnicas", pt: "Ferramentas e técnicas",
    it: "Strumenti e tecniche", de: "Werkzeuge und Techniken"
  },
  commonMistakeLabel: {
    en: "Common mistake: ", ar: "خطأ شائع: ", ary: "Ghalta kaytkarrer bzzaf: ",
    fr: "Erreur fréquente : ", es: "Error común: ", pt: "Erro comum: ",
    it: "Errore comune: ", de: "Häufiger Fehler: "
  },
  achievementsTitle: {
    en: "Achievements", ar: "الإنجازات", ary: "Njazat", fr: "Réussites",
    es: "Logros", pt: "Conquistas", it: "Obiettivi", de: "Erfolge"
  },
  achievementUnlocked: {
    en: "Achievement unlocked: {name}!", ar: "إنجاز جديد: {name}!", ary: "Njaz jdid: {name}!",
    fr: "Nouveau succès : {name} !", es: "¡Logro desbloqueado: {name}!", pt: "Conquista desbloqueada: {name}!",
    it: "Obiettivo sbloccato: {name}!", de: "Erfolg freigeschaltet: {name}!"
  },
  achievementLocked: {
    en: "Not unlocked yet", ar: "لم يُنجز بعد", ary: "Mazal ma tnjaz",
    fr: "Pas encore débloqué", es: "Aún no desbloqueado", pt: "Ainda não desbloqueado",
    it: "Non ancora sbloccato", de: "Noch nicht freigeschaltet"
  },
  downloadCertificate: {
    en: "Download certificate", ar: "تحميل الشهادة", ary: "Download chahada",
    fr: "Télécharger le certificat", es: "Descargar certificado", pt: "Baixar certificado",
    it: "Scarica certificato", de: "Zertifikat herunterladen"
  },
  certificateHeading: {
    en: "Certificate of Completion", ar: "شهادة إتمام", ary: "Chahada dyal tkmil",
    fr: "Certificat de réussite", es: "Certificado de finalización", pt: "Certificado de conclusão",
    it: "Certificato di completamento", de: "Abschlusszertifikat"
  },
  certificateDate: {
    en: "Awarded on {date}", ar: "مُنحت بتاريخ {date}", ary: "Ttmenhat f {date}",
    fr: "Décerné le {date}", es: "Otorgado el {date}", pt: "Concedido em {date}",
    it: "Rilasciato il {date}", de: "Verliehen am {date}"
  },
  achv_first_lesson_title: { en: "First Step", ar: "الخطوة الأولى", ary: "Lakhtwa loula", fr: "Premier pas", es: "Primer paso", pt: "Primeiro passo", it: "Primo passo", de: "Erster Schritt" },
  achv_first_lesson_desc: { en: "Complete your first lesson", ar: "أكمل درسك الأول", ary: "Kmmel awal dars", fr: "Terminez votre première leçon", es: "Completa tu primera lección", pt: "Conclua sua primeira lição", it: "Completa la tua prima lezione", de: "Schließe deine erste Lektion ab" },
  achv_ten_lessons_title: { en: "Getting Started", ar: "بداية جادة", ary: "Bidaya jadia", fr: "En route", es: "Empezando en serio", pt: "Pegando ritmo", it: "Si comincia", de: "Guter Start" },
  achv_ten_lessons_desc: { en: "Complete 10 lessons", ar: "أكمل 10 دروس", ary: "Kmmel 10 dorous", fr: "Terminez 10 leçons", es: "Completa 10 lecciones", pt: "Conclua 10 lições", it: "Completa 10 lezioni", de: "Schließe 10 Lektionen ab" },
  achv_fifty_lessons_title: { en: "Dedicated Learner", ar: "متعلم مثابر", ary: "Mote3allem mjtahed", fr: "Apprenant assidu", es: "Alumno dedicado", pt: "Aluno dedicado", it: "Studente dedicato", de: "Engagierter Lerner" },
  achv_fifty_lessons_desc: { en: "Complete 50 lessons", ar: "أكمل 50 درسًا", ary: "Kmmel 50 dars", fr: "Terminez 50 leçons", es: "Completa 50 lecciones", pt: "Conclua 50 lições", it: "Completa 50 lezioni", de: "Schließe 50 Lektionen ab" },
  achv_first_book_title: { en: "First Book Finished", ar: "أول كتاب مكتمل", ary: "Awal kteb kmel", fr: "Premier livre terminé", es: "Primer libro terminado", pt: "Primeiro livro concluído", it: "Primo libro completato", de: "Erstes Buch beendet" },
  achv_first_book_desc: { en: "Finish your first track", ar: "أنهِ أول مسار لك", ary: "Sali awal massar dyalek", fr: "Terminez votre premier parcours", es: "Termina tu primer curso", pt: "Termine seu primeiro curso", it: "Completa il tuo primo percorso", de: "Schließe deinen ersten Kurs ab" },
  achv_three_books_title: { en: "Bookworm", ar: "عاشق الكتب", ary: "3achi9 lkotob", fr: "Rat de bibliothèque", es: "Ratón de biblioteca", pt: "Rato de biblioteca", it: "Topo di biblioteca", de: "Bücherwurm" },
  achv_three_books_desc: { en: "Finish 3 tracks", ar: "أنهِ 3 مسارات", ary: "Sali 3 massarat", fr: "Terminez 3 parcours", es: "Termina 3 cursos", pt: "Termine 3 cursos", it: "Completa 3 percorsi", de: "Schließe 3 Kurse ab" },
  achv_streak_3_title: { en: "3-Day Streak", ar: "سلسلة 3 أيام", ary: "Silsila 3 dyam", fr: "Série de 3 jours", es: "Racha de 3 días", pt: "Sequência de 3 dias", it: "Serie di 3 giorni", de: "3-Tage-Serie" },
  achv_streak_3_desc: { en: "Learn 3 days in a row", ar: "تعلّم 3 أيام متتالية", ary: "T3allem 3 dyam mtwaliyin", fr: "Apprenez 3 jours de suite", es: "Aprende 3 días seguidos", pt: "Aprenda 3 dias seguidos", it: "Impara per 3 giorni di fila", de: "Lerne 3 Tage in Folge" },
  achv_streak_7_title: { en: "Week Warrior", ar: "محارب الأسبوع", ary: "Moharib ssimana", fr: "Guerrier de la semaine", es: "Guerrero de la semana", pt: "Guerreiro da semana", it: "Guerriero della settimana", de: "Wochenkrieger" },
  achv_streak_7_desc: { en: "Learn 7 days in a row", ar: "تعلّم 7 أيام متتالية", ary: "T3allem 7 dyam mtwaliyin", fr: "Apprenez 7 jours de suite", es: "Aprende 7 días seguidos", pt: "Aprenda 7 dias seguidos", it: "Impara per 7 giorni di fila", de: "Lerne 7 Tage in Folge" },
  achv_streak_30_title: { en: "Monthly Master", ar: "سيد الشهر", ary: "Sid chhar", fr: "Maître du mois", es: "Maestro del mes", pt: "Mestre do mês", it: "Maestro del mese", de: "Meister des Monats" },
  achv_streak_30_desc: { en: "Learn 30 days in a row", ar: "تعلّم 30 يومًا متتاليًا", ary: "T3allem 30 nhar mtwaliyin", fr: "Apprenez 30 jours de suite", es: "Aprende 30 días seguidos", pt: "Aprenda 30 dias seguidos", it: "Impara per 30 giorni di fila", de: "Lerne 30 Tage in Folge" }
};
