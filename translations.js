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
  startDesc: {
    en: "Choose a skill from the shelves to begin your journey.", ar: "اختر مهارة من الأرفف أدناه لتبدأ رحلتك.",
    ary: "Khtar chi maharat mn rrofouf bach tbda l-masira.", fr: "Choisissez une compétence pour commencer votre parcours.",
    es: "Elige una habilidad de las estanterías para comenzar.", pt: "Escolha uma habilidade para começar sua jornada.",
    it: "Scegli una competenza dagli scaffali per iniziare.", de: "Wähle eine Fähigkeit aus dem Regal, um zu beginnen."
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
  }
};
