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
  resetAll: {
    en: "Reset all data", ar: "مسح كل البيانات", ary: "M7a ga3 l-bayanat",
    fr: "Réinitialiser toutes les données", es: "Restablecer todos los datos", pt: "Redefinir todos os dados",
    it: "Azzera tutti i dati", de: "Alle Daten zurücksetzen"
  },
  resetAllConfirm: {
    en: "Delete all saved learning progress, notes, streaks, and recommendations? This cannot be undone.", ar: "هل تريد حذف كل تقدمك التعليمي والملاحظات والسلسلة والتوصيات؟ لا يمكن التراجع عن هذا.", ary: "Bghiti tm7a ga3 tta9addom dyalek, l-mou7addarat, l-silsila w l-tawsiyat? Had chay ma yamknch t3awed.",
    fr: "Supprimer toute votre progression d’apprentissage, notes, série et recommandations ? Cette action est irréversible.", es: "¿Borrar todo tu progreso de aprendizaje, notas, racha y recomendaciones? Esta acción no se puede deshacer.", pt: "Excluir todo o seu progresso de aprendizagem, anotações, sequência e recomendações? Isso não pode ser desfeito.",
    it: "Eliminare tutti i tuoi progressi, appunti, serie e consigli? Questa azione non può essere annullata.", de: "Alle Lernfortschritte, Notizen, Serien und Empfehlungen löschen? Das kann nicht rückgängig gemacht werden."
  },
  resetAllDone: {
    en: "All learning data has been cleared.", ar: "تم حذف كل بيانات التعلم.", ary: "Tma m7a ga3 bayanat l-ta3lim.",
    fr: "Toutes les données d’apprentissage ont été effacées.", es: "Todos los datos de aprendizaje han sido borrados.", pt: "Todos os dados de aprendizado foram apagados.",
    it: "Tutti i dati di apprendimento sono stati eliminati.", de: "Alle Lern-Daten wurden gelöscht."
  },
  statusOnline: {
    en: "Online", ar: "متصل", ary: "Mtatssil",
    fr: "En ligne", es: "En línea", pt: "Online",
    it: "Online", de: "Online"
  },
  statusOffline: {
    en: "Offline", ar: "غير متصل", ary: "Machi mtatssil",
    fr: "Hors ligne", es: "Sin conexión", pt: "Offline",
    it: "Offline", de: "Offline"
  },
  shareProgress: {
    en: "Share progress", ar: "مشاركة التقدم", ary: "B3tt lliya tta9addom",
    fr: "Partager la progression", es: "Compartir progreso", pt: "Compartilhar progresso",
    it: "Condividi progresso", de: "Fortschritt teilen"
  },
  shareProgressText: {
    en: "I’ve completed {done} of {total} lessons ({percent}%) in Masar.",
    ar: "أنهيت {done} من {total} درسًا ({percent}%) في مسار.",
    ary: "Kmlt {done} mn {total} dorous ({percent}%) f Masar.",
    fr: "J’ai terminé {done} leçons sur {total} ({percent}%) sur Masar.",
    es: "He completado {done} de {total} lecciones ({percent}%) en Masar.",
    pt: "Concluí {done} de {total} lições ({percent}%) no Masar.",
    it: "Ho completato {done} di {total} lezioni ({percent}%) su Masar.",
    de: "Ich habe {done} von {total} Lektionen ({percent}%) in Masar abgeschlossen."
  },
  shareCopied: {
    en: "Progress summary copied to clipboard.", ar: "تم نسخ ملخص التقدم إلى الحافظة.", ary: "Tnsakh l-mujmal dyal tta9addom l l-klippboard.",
    fr: "Résumé de la progression copié dans le presse-papiers.", es: "Resumen del progreso copiado al portapapeles.",
    pt: "Resumo do progresso copiado para a área de transferência.", it: "Riepilogo del progresso copiato negli appunti.",
    de: "Fortschrittszusammenfassung in die Zwischenablage kopiert."
  },
  shareFallback: {
    en: "Sharing isn’t available here, but your summary is ready to copy.", ar: "المشاركة غير متاحة هنا، لكن الملخص جاهز للنسخ.", ary: "L-b3th machi mt7ajji hna, bss l-mujmal 3ndek 3la lnsakh.",
    fr: "Le partage n’est pas disponible ici, mais le résumé est prêt à être copié.", es: "La compartición no está disponible aquí, pero el resumen está listo para copiar.",
    pt: "O compartilhamento não está disponível aqui, mas o resumo está pronto para copiar.", it: "La condivisione non è disponibile qui, ma il riepilogo è pronto da copiare.",
    de: "Teilen ist hier nicht verfügbar, aber die Zusammenfassung kann kopiert werden."
  },
  installApp: {
    en: "Install app", ar: "تثبيت التطبيق", ary: "Tathbit l-tatbi9",
    fr: "Installer l’application", es: "Instalar aplicación", pt: "Instalar app",
    it: "Installa app", de: "App installieren"
  },
  installUnavailable: {
    en: "App installation is not available on this device yet.", ar: "تثبيت التطبيق غير متاح بعد على هذا الجهاز.", ary: "Tathbit l-tatbi9 ma kaynach mt7ajji 3la had l-jihaz ba9a.",
    fr: "L’installation de l’application n’est pas encore disponible sur cet appareil.", es: "La instalación de la aplicación aún no está disponible en este dispositivo.",
    pt: "A instalação do app ainda não está disponível neste dispositivo.", it: "L’installazione dell’app non è ancora disponibile su questo dispositivo.",
    de: "Die App-Installation ist auf diesem Gerät noch nicht verfügbar."
  },
  skipToContent: {
    en: "Skip to content", ar: "تخطي إلى المحتوى", ary: "Tkhtti l content",
    fr: "Aller au contenu", es: "Saltar al contenido", pt: "Pular para o conteúdo",
    it: "Salta al contenuto", de: "Zum Inhalt springen"
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
  portfolioTitle: {
    en: "Portfolio & profile", ar: "المعرض الشخصي والملف", ary: "Portfolio w profil", fr: "Portfolio et profil",
    es: "Portafolio y perfil", pt: "Portfólio e perfil", it: "Portfolio e profilo", de: "Portfolio und Profil"
  },
  portfolioEvidence: {
    en: "Evidence", ar: "الأدلة", ary: "Ladella", fr: "Preuves", es: "Evidencia", pt: "Evidência",
    it: "Prove", de: "Nachweise"
  },
  portfolioTracks: {
    en: "tracks", ar: "مسارات", ary: "massarat", fr: "parcours", es: "rutas", pt: "trilhas",
    it: "percorsi", de: "Pfade"
  },
  portfolioProgress: {
    en: "Progress", ar: "التقدم", ary: "Tta9addom", fr: "Progression", es: "Progreso", pt: "Progresso",
    it: "Avanzamento", de: "Fortschritt"
  },
  portfolioPractice: {
    en: "Practice notes", ar: "ملاحظات التطبيق", ary: "Mouhadharat", fr: "Notes de pratique", es: "Notas", pt: "Notas",
    it: "Note di pratica", de: "Notizen"
  },
  portfolioGoal: {
    en: "Goal", ar: "الهدف", ary: "Lhadaf", fr: "Objectif", es: "Objetivo", pt: "Objetivo",
    it: "Obiettivo", de: "Ziel"
  },
  portfolioLevel: {
    en: "Level", ar: "المستوى", ary: "Lmstawa", fr: "Niveau", es: "Nivel", pt: "Nível",
    it: "Livello", de: "Niveau"
  },
  portfolioPrivacy: {
    en: "Privacy", ar: "الخصوصية", ary: "Lkhasousiya", fr: "Confidentialité", es: "Privacidad", pt: "Privacidade",
    it: "Privacy", de: "Datenschutz"
  },
  portfolioPrivate: {
    en: "Private by default", ar: "خاص افتراضيًا", ary: "Khass btt9rir", fr: "Privé par défaut", es: "Privado por defecto",
    pt: "Privado por padrão", it: "Privato per impostazione predefinita", de: "Standardmäßig privat"
  },
  profileGeneral: {
    en: "General", ar: "عام", ary: "3am", fr: "Général", es: "General", pt: "Geral",
    it: "Generale", de: "Allgemein"
  },
  planTitle: {
    en: "Personal learning plan", ar: "الخطة التعليمية الشخصية", ary: "Lkhtaa l3ilmiya lchakhsiya", fr: "Plan d'apprentissage personnel",
    es: "Plan de aprendizaje personal", pt: "Plano de aprendizagem pessoal", it: "Piano di apprendimento personale", de: "Persönlicher Lernplan"
  },
  planWeek1: { en: "Week 1", ar: "الأسبوع 1", ary: "Lusbu3 1", fr: "Semaine 1", es: "Semana 1", pt: "Semana 1", it: "Settimana 1", de: "Woche 1" },
  planWeek2: { en: "Week 2", ar: "الأسبوع 2", ary: "Lusbu3 2", fr: "Semaine 2", es: "Semana 2", pt: "Semana 2", it: "Settimana 2", de: "Woche 2" },
  planWeek3: { en: "Week 3", ar: "الأسبوع 3", ary: "Lusbu3 3", fr: "Semaine 3", es: "Semana 3", pt: "Semana 3", it: "Settimana 3", de: "Woche 3" },
  planWeek4: { en: "Week 4", ar: "الأسبوع 4", ary: "Lusbu3 4", fr: "Semaine 4", es: "Semana 4", pt: "Semana 4", it: "Settimana 4", de: "Woche 4" },
  planFocusOn: { en: "Focus on", ar: "ركز على", ary: "Rkz 3la", fr: "Concentrez-vous sur", es: "Enfócate en", pt: "Foque em", it: "Concentrati su", de: "Konzentriere dich auf" },
  planNextFocus: { en: "Next focus", ar: "التركيز التالي", ary: "Rkz lqbli", fr: "Prochaine étape", es: "Siguiente enfoque", pt: "Próximo foco", it: "Prossimo focus", de: "Nächster Fokus" },
  planKeepGoing: { en: "Keep the momentum going with short, consistent practice.", ar: "واصل الزخم بخطوات قصيرة ومتسقة.", ary: "Mashi blllzma b7jja qasira mtwssia.", fr: "Gardez l'élan avec de courtes sessions régulières.", es: "Mantén el impulso con práctica corta y constante.", pt: "Mantenha o ritmo com prática curta e consistente.", it: "Mantieni il ritmo con pratica breve e costante.", de: "Halte den Schwung mit kurzen, regelmäßigen Übungen aufrecht." },
  quickPlanTitle: {
    en: "I have 10 minutes", ar: "لديّ 10 دقائق", ary: "3andi 10 daqaiq", fr: "J’ai 10 minutes", es: "Tengo 10 minutos", pt: "Tenho 10 minutos",
    it: "Ho 10 minuti", de: "Ich habe 10 Minuten"
  },
  tenMinuteTitle: { en: "Quick win", ar: "إنجاز سريع", ary: "Njaz sarii3", fr: "Coup de pouce rapide", es: "Victoria rápida", pt: "Vitória rápida", it: "Vittoria veloce", de: "Schneller Erfolg" },
  tenMinuteReview: { en: "Review this concept", ar: "راجع هذا المفهوم", ary: "Rja3 had lmo3na", fr: "Réviser ce concept", es: "Repasa este concepto", pt: "Revisar este conceito", it: "Ripassa questo concetto", de: "Dieses Konzept wiederholen" },
  tenMinuteRecommended: { en: "Continue this track", ar: "واصل هذا المسار", ary: "Mashi b had ssafar", fr: "Continuer ce parcours", es: "Continúa esta ruta", pt: "Continuar esta trilha", it: "Continua questo percorso", de: "Diesen Pfad fortsetzen" },
  tenMinuteFallback: { en: "Start with a short concept review", ar: "ابدأ بمراجعة قصيرة للمفهوم", ary: "Bda bmrj3a qasira", fr: "Commencez par une brève révision", es: "Comienza con una revisión breve", pt: "Comece com uma revisão curta", it: "Inizia con una breve revisione", de: "Beginne mit einer kurzen Wiederholung" },
  tenMinuteFallbackDetail: { en: "A tiny review is better than a long pause. Keep the streak alive.", ar: "مراجعة قصيرة أفضل من توقف طويل. حافظ على سلسلتك.", ary: "Mraj3a qasira a7san mn waqf 7awil. Hfiz 3la silsiltk.", fr: "Une petite révision vaut mieux qu'une longue pause. Gardez la série.", es: "Una breve revisión vale más que una pausa larga. Mantén la racha.", pt: "Uma revisão curta vale mais do que uma pausa longa. Mantenha a sequência.", it: "Una breve revisione vale più di una lunga pausa. Mantieni la serie.", de: "Eine kurze Wiederholung ist besser als eine lange Pause. Halte die Serie am Laufen." },
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
  achv_streak_30_desc: { en: "Learn 30 days in a row", ar: "تعلّم 30 يومًا متتاليًا", ary: "T3allem 30 nhar mtwaliyin", fr: "Apprenez 30 jours de suite", es: "Aprende 30 días seguidos", pt: "Aprenda 30 dias seguidos", it: "Impara per 30 giorni di fila", de: "Lerne 30 Tage in Folge" },
  achv_challenge_solver_title: { en: "Challenge Solver", ar: "حلّال التحديات", ary: "Hallal dyal tahaddiyat", fr: "Résolveur de défis", es: "Solucionador de retos", pt: "Solucionador de desafios", it: "Risolutore di sfide", de: "Herausforderungslöser" },
  achv_challenge_solver_desc: { en: "Solve your first challenge", ar: "حلّ أول تحدٍّ لك", ary: "Hall awal tahaddi dyalek", fr: "Résolvez votre premier défi", es: "Resuelve tu primer reto", pt: "Resolva seu primeiro desafio", it: "Risolvi la tua prima sfida", de: "Löse deine erste Herausforderung" },
  achv_assessment_ace_title: { en: "Assessment Ace", ar: "بطل الاختبارات", ary: "Batal dyal lekhtibarat", fr: "As de l'évaluation", es: "As de la evaluación", pt: "Craque da avaliação", it: "Asso della valutazione", de: "Prüfungs-Ass" },
  achv_assessment_ace_desc: { en: "Score 90% or higher on a final assessment", ar: "احصل على 90% أو أكثر في اختبار نهائي", ary: "Khoud 90% aw ktar f ikhtibar niha2i", fr: "Obtenez 90 % ou plus à une évaluation finale", es: "Obtén un 90% o más en una evaluación final", pt: "Obtenha 90% ou mais em uma avaliação final", it: "Ottieni almeno il 90% in una valutazione finale", de: "Erreiche 90 % oder mehr bei einer Abschlussprüfung" },

  // ===== Onboarding / personalization =====
  onboardingTitle: {
    en: "Let's personalize your shelf", ar: "لنُخصّص رفّك", ary: "Khlliw n5essiw rref dyalek",
    fr: "Personnalisons votre étagère", es: "Personalicemos tu estantería", pt: "Vamos personalizar sua estante",
    it: "Personalizziamo il tuo scaffale", de: "Personalisieren wir dein Regal"
  },
  onboardingGoalQuestion: {
    en: "What do you want to learn first?", ar: "ماذا تريد أن تتعلم أولًا؟", ary: "Ach bghiti tt3allem lawal?",
    fr: "Que voulez-vous apprendre en premier ?", es: "¿Qué quieres aprender primero?", pt: "O que você quer aprender primeiro?",
    it: "Cosa vuoi imparare per primo?", de: "Was möchtest du zuerst lernen?"
  },
  onboardingLevelQuestion: {
    en: "How would you describe your level?", ar: "كيف تصف مستواك؟", ary: "Kifach ghadi twassef niveau dyalek?",
    fr: "Comment décririez-vous votre niveau ?", es: "¿Cómo describirías tu nivel?", pt: "Como você descreveria seu nível?",
    it: "Come descriveresti il tuo livello?", de: "Wie würdest du dein Niveau einschätzen?"
  },
  onboardingSkip: {
    en: "Skip for now", ar: "تخطّي الآن", ary: "Tkhtti daba", fr: "Passer pour l'instant",
    es: "Omitir por ahora", pt: "Pular por agora", it: "Salta per ora", de: "Vorerst überspringen"
  },
  onboardingSave: {
    en: "Show my recommendations", ar: "أظهر توصياتي", ary: "Wri liya ttawsiyat dyali",
    fr: "Afficher mes recommandations", es: "Mostrar mis recomendaciones", pt: "Mostrar minhas recomendações",
    it: "Mostra i miei consigli", de: "Meine Empfehlungen anzeigen"
  },
  recommendedTitle: {
    en: "Recommended for you", ar: "موصى به لك", ary: "Mo9tara7 lik",
    fr: "Recommandé pour vous", es: "Recomendado para ti", pt: "Recomendado para você",
    it: "Consigliato per te", de: "Für dich empfohlen"
  },
  editPreferences: {
    en: "Edit preferences", ar: "تعديل التفضيلات", ary: "Beddel ttafdilat",
    fr: "Modifier les préférences", es: "Editar preferencias", pt: "Editar preferências",
    it: "Modifica preferenze", de: "Einstellungen bearbeiten"
  },

  // ===== Skill graph: soft prerequisite hint on a book card =====
  suggestedAfter: {
    en: "Suggested after: {title}", ar: "يُنصح به بعد: {title}", ary: "Mnasse7 bih mn ba3d: {title}",
    fr: "Conseillé après : {title}", es: "Sugerido después de: {title}", pt: "Sugerido após: {title}",
    it: "Consigliato dopo: {title}", de: "Empfohlen nach: {title}"
  },

  // ===== Skill mastery panel =====
  masteryPanelTitle: {
    en: "Skill mastery", ar: "إتقان المهارة", ary: "Itqan lmahara",
    fr: "Maîtrise de la compétence", es: "Dominio de la habilidad", pt: "Domínio da habilidade",
    it: "Padronanza della competenza", de: "Kompetenzbeherrschung"
  },
  masteryKnowledgeLabel: {
    en: "Knowledge", ar: "المعرفة", ary: "Lma3rifa",
    fr: "Connaissance", es: "Conocimiento", pt: "Conhecimento",
    it: "Conoscenza", de: "Wissen"
  },
  masteryPracticeLabel: {
    en: "Practice", ar: "التطبيق", ary: "Ttatbi9",
    fr: "Pratique", es: "Práctica", pt: "Prática",
    it: "Pratica", de: "Übung"
  },
  masteryRetentionLabel: {
    en: "Retention", ar: "الاستيعاب طويل المدى", ary: "Retention (l7ifd 3la lmadda ttwila)",
    fr: "Rétention", es: "Retención", pt: "Retenção",
    it: "Ritenzione", de: "Behalten"
  },
  masteryRetentionPending: {
    en: "Not enough data yet", ar: "لا توجد بيانات كافية بعد", ary: "Mazal ma kayench data kafiya",
    fr: "Pas encore assez de données", es: "Aún no hay suficientes datos", pt: "Ainda não há dados suficientes",
    it: "Non ci sono ancora dati sufficienti", de: "Noch nicht genug Daten"
  },
  masteryOverallLabel: {
    en: "Overall mastery", ar: "الإتقان الإجمالي", ary: "Itqan globali",
    fr: "Maîtrise globale", es: "Dominio general", pt: "Domínio geral",
    it: "Padronanza complessiva", de: "Gesamtbeherrschung"
  },
  masteryHint: {
    en: "Grows as you complete lessons and write practice answers below them.",
    ar: "يزداد كلما أكملت الدروس وكتبت إجابات التطبيق العملي تحتها.",
    ary: "Kayzid kolma kmmelti dorous w ktebti jjwabat dyal ttatbi9 t7tehom.",
    fr: "Progresse à mesure que vous terminez les leçons et rédigez vos réponses de pratique.",
    es: "Crece a medida que completas lecciones y escribes tus respuestas de práctica.",
    pt: "Cresce à medida que você completa lições e escreve suas respostas de prática.",
    it: "Cresce man mano che completi le lezioni e scrivi le tue risposte di pratica.",
    de: "Wächst, während du Lektionen abschließt und Übungsantworten schreibst."
  },
  masteryState_notStarted: {
    en: "Not started", ar: "لم يبدأ", ary: "Mabdach",
    fr: "Non commencé", es: "No iniciado", pt: "Não iniciado",
    it: "Non iniziato", de: "Nicht begonnen"
  },
  masteryState_learning: {
    en: "Learning", ar: "قيد التعلم", ary: "Kat3allem",
    fr: "En apprentissage", es: "Aprendiendo", pt: "Aprendendo",
    it: "In apprendimento", de: "Am Lernen"
  },
  masteryState_practicing: {
    en: "Practicing", ar: "قيد التطبيق", ary: "Kattatbe9",
    fr: "En pratique", es: "Practicando", pt: "Praticando",
    it: "In pratica", de: "Am Üben"
  },
  masteryState_developing: {
    en: "Developing", ar: "في تطور", ary: "Katatwar",
    fr: "En progression", es: "En desarrollo", pt: "Em desenvolvimento",
    it: "In sviluppo", de: "In Entwicklung"
  },
  masteryState_proficient: {
    en: "Proficient", ar: "متمكن", ary: "Mtmakken",
    fr: "Compétent", es: "Competente", pt: "Competente",
    it: "Competente", de: "Kompetent"
  },
  masteryState_mastered: {
    en: "Mastered", ar: "متقَن بالكامل", ary: "Mtqen b l-kamel",
    fr: "Maîtrisé", es: "Dominado", pt: "Dominado",
    it: "Padroneggiato", de: "Gemeistert"
  },

  // ===== Hands-on practice notes =====
  practiceLabel: {
    en: "Try it yourself", ar: "جرّب بنفسك", ary: "Jreb b rassek", fr: "Essayez par vous-même",
    es: "Pruébalo tú mismo", pt: "Experimente você mesmo", it: "Provaci tu stesso", de: "Probier's selbst"
  },
  practicePlaceholder: {
    en: "Write your answer or notes here...", ar: "اكتب إجابتك أو ملاحظاتك هنا...", ary: "Kteb jjawab dyalek wla lmola7adat hna...",
    fr: "Écrivez votre réponse ou vos notes ici...", es: "Escribe tu respuesta o notas aquí...",
    pt: "Escreva sua resposta ou notas aqui...", it: "Scrivi qui la tua risposta o le tue note...",
    de: "Schreibe hier deine Antwort oder Notizen..."
  },
  practiceSaved: {
    en: "Saved locally ✓", ar: "تم الحفظ محليًا ✓", ary: "Ttsajel f jihaz dyalek ✓",
    fr: "Enregistré localement ✓", es: "Guardado localmente ✓", pt: "Salvo localmente ✓",
    it: "Salvato localmente ✓", de: "Lokal gespeichert ✓"
  },

  // ===== Quiz / instant-check practice engine =====
  quizLabel: {
    en: "Quick check", ar: "اختبار سريع", ary: "Ikhtibar sari3",
    fr: "Vérification rapide", es: "Comprobación rápida", pt: "Verificação rápida",
    it: "Verifica rapida", de: "Schnelltest"
  },
  quizCorrect: {
    en: "Correct!", ar: "إجابة صحيحة!", ary: "Jawab s7i7!",
    fr: "Bonne réponse !", es: "¡Correcto!", pt: "Correto!",
    it: "Corretto!", de: "Richtig!"
  },
  quizIncorrect: {
    en: "Not quite.", ar: "ليست إجابة صحيحة.", ary: "Machi s7i7 mzyan.",
    fr: "Pas tout à fait.", es: "No del todo.", pt: "Não exatamente.",
    it: "Non proprio.", de: "Nicht ganz."
  },

  // ===== XP & Levels (derived, not persisted separately) =====
  levelBadgeLabel: {
    en: "Level {level}", ar: "المستوى {level}", ary: "Niveau {level}",
    fr: "Niveau {level}", es: "Nivel {level}", pt: "Nível {level}",
    it: "Livello {level}", de: "Level {level}"
  },
  xpLabel: {
    en: "{xp} XP", ar: "{xp} نقطة", ary: "{xp} nou9ta",
    fr: "{xp} XP", es: "{xp} XP", pt: "{xp} XP",
    it: "{xp} XP", de: "{xp} XP"
  },
  levelProgressHint: {
    en: "{current} / {next} XP to next level", ar: "{current} / {next} نقطة للمستوى التالي", ary: "{current} / {next} nou9ta l niveau li mn ba3d",
    fr: "{current} / {next} XP avant le niveau suivant", es: "{current} / {next} XP para el siguiente nivel", pt: "{current} / {next} XP para o próximo nível",
    it: "{current} / {next} XP al prossimo livello", de: "{current} / {next} XP bis zum nächsten Level"
  },

  // ===== Community helpful votes =====
  helpfulQuestion: {
    en: "Was this lesson helpful?", ar: "هل كان هذا الدرس مفيدًا؟", ary: "Wach had ddars kan mofid?",
    fr: "Cette leçon vous a-t-elle été utile ?", es: "¿Te resultó útil esta lección?", pt: "Esta lição foi útil?",
    it: "Questa lezione è stata utile?", de: "War diese Lektion hilfreich?"
  },
  markHelpful: {
    en: "👍 Yes, helpful", ar: "👍 نعم، مفيد", ary: "👍 Ah, mofid", fr: "👍 Oui, utile",
    es: "👍 Sí, útil", pt: "👍 Sim, útil", it: "👍 Sì, utile", de: "👍 Ja, hilfreich"
  },
  helpfulThanks: {
    en: "Thanks for your feedback!", ar: "شكرًا على ملاحظتك!", ary: "Chokran 3la ra2yek!",
    fr: "Merci pour votre retour !", es: "¡Gracias por tu opinión!", pt: "Obrigado pelo feedback!",
    it: "Grazie per il tuo feedback!", de: "Danke für dein Feedback!"
  },

  // ===== Skill map and recommendation reasons =====
  skillMapTitle: {
    en: "Skill map", ar: "خريطة المهارة", ary: "KhriTat lmahara",
    fr: "Carte des compétences", es: "Mapa de habilidades", pt: "Mapa de habilidades",
    it: "Mappa delle competenze", de: "Fähigkeitenkarte"
  },
  skillMapCurrent: {
    en: "Current skill", ar: "المهارة الحالية", ary: "Lmahara l7alya",
    fr: "Compétence actuelle", es: "Habilidad actual", pt: "Habilidade atual",
    it: "Competenza attuale", de: "Aktuelle Fähigkeit"
  },
  skillMapPrerequisites: {
    en: "Prerequisites", ar: "المتطلبات السابقة", ary: "Lmutatlabat sba9a",
    fr: "Prérequis", es: "Requisitos previos", pt: "Pré-requisitos",
    it: "Prerequisiti", de: "Voraussetzungen"
  },
  skillMapWeakness: {
    en: "Current weakness", ar: "نقطة الضعف الحالية", ary: "N9ta l3afya l7alya",
    fr: "Point faible actuel", es: "Debilidad actual", pt: "Ponto fraco atual",
    it: "Punto debole attuale", de: "Aktuelle Schwäche"
  },
  skillMapNext: {
    en: "Next skill", ar: "المهارة التالية", ary: "Lmahara ltaliya",
    fr: "Compétence suivante", es: "Siguiente habilidad", pt: "Próxima habilidade",
    it: "Prossima competenza", de: "Nächste Fähigkeit"
  },
  skillMapProject: {
    en: "Project", ar: "المشروع", ary: "Lmoghar", fr: "Projet", es: "Proyecto",
    pt: "Projeto", it: "Progetto", de: "Projekt"
  },
  skillMapMastery: {
    en: "Mastery", ar: "الإتقان", ary: "Itqan", fr: "Maîtrise", es: "Dominio",
    pt: "Domínio", it: "Padronanza", de: "Beherrschung"
  },
  skillMapNoPrerequisites: {
    en: "No major prerequisite blocked", ar: "لا توجد متطلبات سابقة تعيقك", ary: "Ma kaynch mutatlabat sba9a",
    fr: "Aucun prérequis bloquant", es: "No hay requisitos previos bloqueantes", pt: "Nenhum pré-requisito bloqueante",
    it: "Nessun prerequisito bloccante", de: "Keine blockierenden Voraussetzungen"
  },
  skillMapStrong: {
    en: "No clear weakness detected", ar: "لا توجد نقطة ضعف واضحة", ary: "Ma kaynch n9ta 3afya wadh7a",
    fr: "Aucune faiblesse claire détectée", es: "No se detecta una debilidad clara", pt: "Nenhuma fraqueza clara detectada",
    it: "Nessun punto debole chiaro", de: "Keine klare Schwäche erkannt"
  },
  skillMapFinished: {
    en: "You’ve reached the end of this skill path", ar: "لقد وصلت إلى نهاية هذا المسار", ary: "Wslti 3la nihayat had ssafar",
    fr: "Vous avez terminé ce parcours", es: "Has llegado al final de este recorrido", pt: "Você chegou ao fim deste caminho",
    it: "Hai raggiunto la fine di questo percorso", de: "Du hast das Ende dieses Pfads erreicht"
  },
  skillMapProjectReady: {
    en: "Mini project: build a practical task using {title}", ar: "مشروع مصغر: أنشئ مهمة عملية باستخدام {title}", ary: "Mochar3 saghir: 7al l7aja 3amaliya b {title}",
    fr: "Mini-projet : créez une tâche pratique avec {title}", es: "Mini proyecto: crea una tarea práctica con {title}", pt: "Mini projeto: crie uma tarefa prática usando {title}",
    it: "Mini progetto: crea un compito pratico usando {title}", de: "Mini-Projekt: Baue eine praktische Aufgabe mit {title}"
  },
  skillMapProjectPractice: {
    en: "Practice push: finish {remaining} more pages to unlock a mini project in {title}", ar: "دفع للتطبيق: أتمم {remaining} صفحة إضافية لفتح مشروع مصغر في {title}", ary: "T3am 3la ttatbi9: tkmal {remaining} sf7at zyada bach t7tess projet saghir f {title}",
    fr: "Exercice pratique : terminez {remaining} pages de plus pour débloquer un mini-projet dans {title}", es: "Empuje de práctica: termina {remaining} páginas más para desbloquear un mini proyecto en {title}", pt: "Exercício prático: termine mais {remaining} páginas para desbloquear um mini projeto em {title}",
    it: "Spinta alla pratica: completa altre {remaining} pagine per sbloccare un mini progetto in {title}", de: "Übungsstoß: Schließe noch {remaining} Seiten ab, um ein Mini-Projekt in {title} freizuschalten"
  },
  reviewTitle: {
    en: "Review queue", ar: "قائمة المراجعة", ary: "Qayma dyal lmraja3a",
    fr: "File de révision", es: "Cola de repaso", pt: "Fila de revisão",
    it: "Coda di ripasso", de: "Wiederholungs-Queue"
  },
  reviewDueToday: {
    en: "Due today", ar: "مستحق اليوم", ary: "Mstahqq lyom",
    fr: "À revoir aujourd'hui", es: "Pendiente hoy", pt: "Vence hoje",
    it: "Da ripassare oggi", de: "Heute fällig"
  },
  reviewReasonFollowUp: {
    en: "Follow-up review for reinforcement", ar: "مراجعة متابعة للتثبيت", ary: "Mraj3a mutaba3a llta3bin",
    fr: "Révision de consolidation", es: "Repaso de refuerzo", pt: "Revisão de reforço",
    it: "Ripasso di consolidamento", de: "Wiederholung zur Festigung"
  },
  insightTitle: {
    en: "Learning insights", ar: "رؤى التعلم", ary: "Rouyaat lta3lim",
    fr: "Aperçus d’apprentissage", es: "Información de aprendizaje", pt: "Insights de aprendizado",
    it: "Approfondimenti di apprendimento", de: "Lern-Einblicke"
  },
  insightDailyGoal: {
    en: "Daily goal", ar: "هدف اليوم", ary: "Hadaf lyawm",
    fr: "Objectif du jour", es: "Meta diaria", pt: "Meta diária",
    it: "Obiettivo giornaliero", de: "Tagesziel"
  },
  insightReview: {
    en: "Due reviews", ar: "مراجعات مستحقة", ary: "Mraj3at mstahqqa",
    fr: "Révisions à faire", es: "Repasos pendientes", pt: "Revisões pendentes",
    it: "Ripassi da fare", de: "Fällige Wiederholungen"
  },
  insightPractice: {
    en: "Practice notes", ar: "ملاحظات التطبيق", ary: "Mou7adaarat lttatbi9",
    fr: "Notes de pratique", es: "Notas de práctica", pt: "Notas de prática",
    it: "Note di pratica", de: "Übungshinweise"
  },
  insightStorage: {
    en: "Data health", ar: "حالة البيانات", ary: "7alat l-bayanat",
    fr: "Santé des données", es: "Estado de los datos", pt: "Saúde dos dados",
    it: "Salute dei dati", de: "Datenstatus"
  },
  insightHealthy: {
    en: "Healthy", ar: "سليم", ary: "Salim",
    fr: "Sain", es: "Saludable", pt: "Saudável",
    it: "Buono", de: "Gut"
  },
  insightNeedsBackup: {
    en: "Back up soon", ar: "احفظ نسخة احتياطية", ary: "7afz nusa kharijiya",
    fr: "Sauvegarder", es: "Respaldar pronto", pt: "Fazer backup",
    it: "Esegui backup", de: "Sicherung erstellen"
  },
  insightReviewHint: {
    en: "short review loop", ar: "حلقة مراجعة قصيرة", ary: "Doura mraj3a 9asira",
    fr: "petit cycle de révision", es: "bucle corta de repaso", pt: "ciclo curto de revisão",
    it: "ciclo breve di ripasso", de: "kurzer Wiederholungszyklus"
  },
  insightPracticeHint: {
    en: "reflections saved", ar: "انعكاسات محفوظة", ary: "In3ikarat m7afza",
    fr: "réflexions enregistrées", es: "reflexiones guardadas", pt: "reflexões salvas",
    it: "riflessioni salvate", de: "gespeicherte Reflexionen"
  },
  insightStorageHint: {
    en: "local backup is recent", ar: "النسخة الاحتياطية حديثة", ary: "nusa l7afaziya jdid",
    fr: "la sauvegarde locale est récente", es: "la copia de seguridad local es reciente", pt: "o backup local é recente",
    it: "il backup locale è recente", de: "die lokale Sicherung ist aktuell"
  },
  insightBackupHint: {
    en: "export a backup to keep progress safe", ar: "صدّر نسخة احتياطية للحفاظ على تقدمك", ary: "Ssir backup bach t7afz 3la tta9addom dyalek",
    fr: "exportez une sauvegarde pour sécuriser votre progression", es: "exporta una copia de seguridad para proteger tu progreso", pt: "exporte um backup para proteger seu progresso",
    it: "esporta un backup per proteggere i tuoi progressi", de: "Erstelle eine Sicherung, um deinen Fortschritt zu schützen"
  },
  journalTitle: {
    en: "Learning journal", ar: "مجلة التعلم", ary: "Majalat lta3lim",
    fr: "Journal d’apprentissage", es: "Diario de aprendizaje", pt: "Diário de aprendizado",
    it: "Diario di apprendimento", de: "Lernjournal"
  },
  journalNotes: {
    en: "Practice notes", ar: "ملاحظات التطبيق", ary: "Mou7adaarat lttatbi9",
    fr: "Notes de pratique", es: "Notas de práctica", pt: "Notas de prática",
    it: "Note di pratica", de: "Übungshinweise"
  },
  journalDue: {
    en: "Due reviews", ar: "مراجعات مستحقة", ary: "Mraj3at mstahqqa",
    fr: "Révisions à faire", es: "Repasos pendientes", pt: "Revisões pendentes",
    it: "Ripassi da fare", de: "Fällige Wiederholungen"
  },
  journalStreak: {
    en: "Current streak", ar: "السلسلة الحالية", ary: "Silsila l7aliya",
    fr: "Série actuelle", es: "Racha actual", pt: "Sequência atual",
    it: "Serie attuale", de: "Aktuelle Serie"
  },
  journalFocus: {
    en: "Current focus", ar: "التركيز الحالي", ary: "Ltrakiz l7ali",
    fr: "Focus actuel", es: "Enfoque actual", pt: "Foco atual",
    it: "Focus attuale", de: "Aktueller Fokus"
  },
  journalEmpty: {
    en: "No practice notes saved yet. Add a short reflection after any lesson to build your learning journal.", ar: "لا توجد ملاحظات تطبيق محفوظة بعد. أضف انعكاسًا قصيرًا بعد أي درس لبناء سجل التعلم الخاص بك.", ary: "Ma kaynach mou7adaarat tatbi9 m7afza ba3d. Zidd in3ikar 9asir b3d ay dars bach t7awel majalat lta3lim dyalek.",
    fr: "Aucune note de pratique enregistrée pour le moment. Ajoutez une courte réflexion après n’importe quelle leçon pour construire votre journal d’apprentissage.", es: "Todavía no hay notas de práctica guardadas. Añade una reflexión breve después de cualquier lección para crear tu diario de aprendizaje.", pt: "Ainda não há anotações de prática salvas. Adicione uma reflexão breve após qualquer lição para construir seu diário de aprendizado.",
    it: "Non ci sono ancora note di pratica salvate. Aggiungi una breve riflessione dopo qualsiasi lezione per costruire il tuo diario di apprendimento.", de: "Es gibt noch keine gespeicherten Übungshinweise. Füge nach jeder Lektion eine kurze Reflexion hinzu, um dein Lernjournal aufzubauen."
  },
  journalEmptyNote: {
    en: "No text captured yet", ar: "لا يوجد نص محفوظ بعد", ary: "Ma kaynach nass m7afz ba3d",
    fr: "Aucun texte enregistré", es: "Todavía no hay texto guardado", pt: "Ainda não há texto salvo",
    it: "Nessun testo salvato ancora", de: "Noch kein Text gespeichert"
  },
  learningPathTitle: {
    en: "Learning path intelligence", ar: "ذكاء المسار التعليمي", ary: "Dhakaa lmasar lta3lmi",
    fr: "Intelligence du parcours", es: "Inteligencia del recorrido", pt: "Inteligência do caminho",
    it: "Intelligenza del percorso", de: "Pfad-Intelligenz"
  },
  pathStrong: {
    en: "Strong foundation", ar: "أساس قوي", ary: "Asas qawi",
    fr: "Base solide", es: "Base sólida", pt: "Base sólida",
    it: "Base solida", de: "Starke Grundlage"
  },
  pathPractice: {
    en: "Practice", ar: "تطبيق", ary: "Ttatbi9",
    fr: "Pratique", es: "Práctica", pt: "Prática",
    it: "Pratica", de: "Übung"
  },
  pathChallenge: {
    en: "Challenge", ar: "تحدي", ary: "T7adi",
    fr: "Défi", es: "Reto", pt: "Desafio",
    it: "Sfida", de: "Herausforderung"
  },
  pathProject: {
    en: "Project", ar: "مشروع", ary: "Mochar3",
    fr: "Projet", es: "Proyecto", pt: "Projeto",
    it: "Progetto", de: "Projekt"
  },
  weaknessConceptIncomplete: {
    en: "This concept is not completed yet", ar: "هذا المفهوم لم يُنجز بعد", ary: "Had lmo3na ma ykmlch ba3d",
    fr: "Ce concept n'est pas encore terminé", es: "Este concepto aún no está completado", pt: "Este conceito ainda não foi concluído",
    it: "Questo concetto non è ancora completato", de: "Dieses Konzept ist noch nicht abgeschlossen"
  },
  weaknessPracticeMissing: {
    en: "Practice is still missing on this concept", ar: "لا يزال التطبيق مفقودًا على هذا المفهوم", ary: "Ttatbi9 mazal mafqoud 3la had lmo3na",
    fr: "La pratique manque encore sur ce concept", es: "Todavía falta práctica en este concepto", pt: "Ainda falta prática neste conceito",
    it: "Manca ancora la pratica su questo concetto", de: "Es fehlt noch Übung zu diesem Konzept"
  },
  recReasonContinue: {
    en: "You are continuing this track: {done} of {total} lessons complete.", ar: "أنت تستمر في هذا المسار: اكتملت {done} من {total} صفحات.", ary: "Anta katmashi f had ssafar: {done} mn {total} sf7at kemlat.",
    fr: "Vous continuez ce parcours : {done} leçons sur {total} terminées.", es: "Estás continuando esta ruta: {done} de {total} lecciones completadas.", pt: "Você está continuando esta trilha: {done} de {total} lições concluídas.",
    it: "Stai continuando questo percorso: {done} di {total} lezioni completate.", de: "Du setzt diesen Pfad fort: {done} von {total} Lektionen abgeschlossen."
  },
  recReasonGoal: {
    en: "This matches your selected goal: {category}.", ar: "هذا يتوافق مع هدفك المختار: {category}.", ary: "Hadya matwaffq ma3a lhadaf li ikhtarti: {category}.",
    fr: "Cela correspond à votre objectif choisi : {category}.", es: "Esto coincide con tu objetivo seleccionado: {category}.", pt: "Isso corresponde ao seu objetivo selecionado: {category}.",
    it: "Corrisponde al tuo obiettivo selezionato: {category}.", de: "Das passt zu deinem gewählten Ziel: {category}."
  },
  recReasonNextUp: {
    en: "Next step after {title}: you’ve already built the base.", ar: "الخطوة التالية بعد {title}: أنت بالفعل بنيت الأساس.", ary: "lkhata ltaliya b3d {title}: qd bnaiti l-asas.",
    fr: "Étape suivante après {title} : vous avez déjà construit la base.", es: "Siguiente paso después de {title}: ya construiste la base.", pt: "Próximo passo após {title}: você já construiu a base.",
    it: "Passo successivo dopo {title}: hai già costruito la base.", de: "Nächster Schritt nach {title}: Die Grundlage ist bereits aufgebaut."
  },
  recReasonWeakness: {
    en: "Weak spot detected: {title} still needs attention ({remaining} items).", ar: "تم اكتشاف نقطة ضعف: {title} ما زال يحتاج إلى مزيد من المراجعة ({remaining} عنصرًا).", ary: "Ttukshif n9ta 3afya: {title} mazal khassu reya ( {remaining} 7aja).",
    fr: "Point faible détecté : {title} nécessite encore de l'attention ({remaining} éléments).", es: "Se detectó un punto débil: {title} aún necesita atención ({remaining} elementos).", pt: "Ponto fraco detectado: {title} ainda precisa de atenção ({remaining} itens).",
    it: "Punto debole rilevato: {title} richiede ancora attenzione ({remaining} elementi).", de: "Schwäche erkannt: {title} braucht noch Aufmerksamkeit ({remaining} Elemente)."
  },
  recReasonReady: {
    en: "Ready for a challenge: your mastery is at {pct}%.", ar: "جاهز لتحدٍ جديد: إتقانك الآن {pct}%.", ary: "Jahiz lilta7did: itqanak daba {pct}%.",
    fr: "Prêt pour un défi : votre maîtrise est à {pct}%.", es: "Listo para un reto: tu dominio es del {pct}%.", pt: "Pronto para um desafio: seu domínio é de {pct}%.",
    it: "Pronto per una sfida: la tua padronanza è al {pct}%.", de: "Bereit für eine Herausforderung: Dein Niveau liegt bei {pct}%."
  },
  recReasonLevel: {
    en: "Matches your {level} level.", ar: "يتوافق مع مستواك {level}.", ary: "Matwaffq ma3a mstawa {level}.",
    fr: "Correspond à votre niveau {level}.", es: "Coincide con tu nivel {level}.", pt: "Combina com seu nível {level}.",
    it: "Corrisponde al tuo livello {level}.", de: "Passt zu deinem Niveau {level}."
  },
  recReasonGeneral: {
    en: "Recommended next based on your current learning progress.", ar: "موصى به كالتالي بناءً على تقدمك التعليمي الحالي.", ary: "Mawsi bihi lkhadma b3as rta9addom dyalek lta3lmi.",
    fr: "Recommandé ensuite selon votre progression actuelle.", es: "Recomendado según tu progreso actual de aprendizaje.", pt: "Recomendado com base no seu progresso atual.",
    it: "Consigliato in base al tuo attuale progresso di apprendimento.", de: "Auf Basis deines aktuellen Lernfortschritts empfohlen."
  },
  // §14: recommendation reason when the user has failed this track's final
  // assessment at least twice in a row — ranked above every other reason
  // in computeRecommendationReason, but the string itself was never added.
  recReasonFailedRepeatedly: {
    en: "You've failed the final assessment {count} times in a row — this needs another pass before moving on.",
    ar: "فشلت في الاختبار النهائي {count} مرات متتالية — يحتاج هذا إلى مراجعة أخرى قبل المتابعة.",
    ary: "Fchelti f lekhtibar nnihai {count} mrat mtwaliyin — hadi khassha mraja3a khra 9bel matkemmel.",
    fr: "Vous avez échoué à l'évaluation finale {count} fois de suite — il faut y revenir avant de continuer.",
    es: "Has fallado la evaluación final {count} veces seguidas — esto necesita otro repaso antes de continuar.",
    pt: "Você falhou na avaliação final {count} vezes seguidas — isso precisa de outra revisão antes de continuar.",
    it: "Hai fallito la valutazione finale {count} volte di fila — serve un altro ripasso prima di andare avanti.",
    de: "Du hast die Abschlussprüfung {count} Mal in Folge nicht bestanden — das braucht einen weiteren Durchgang, bevor du weitermachst."
  },

  // ===== Certificate sharing =====
  shareLinkedin: {
    en: "Share on LinkedIn", ar: "شارك على LinkedIn", ary: "Partagi 3la LinkedIn",
    fr: "Partager sur LinkedIn", es: "Compartir en LinkedIn", pt: "Compartilhar no LinkedIn",
    it: "Condividi su LinkedIn", de: "Auf LinkedIn teilen"
  },

  // ===== Practice quality =====
  practiceMissing: {
    en: "Needs a short explanation", ar: "يحتاج إلى شرح قصير", ary: "Y7taj l7e9a qasira",
    fr: "Besoin d’une explication courte", es: "Necesita una explicación breve", pt: "Precisa de uma explicação curta",
    it: "Serve una breve spiegazione", de: "Braucht eine kurze Erklärung"
  },
  practiceMissingDetail: {
    en: "Write a brief explanation of what you learned in {title} so Masar can identify weak spots.", ar: "اكتب شرحًا موجزًا لما تعلمته في {title} حتى يمكن لـ Masar تحديد نقاط الضعف.", ary: "Kteb chra7 mouwjaz 3la ma3tqadt f {title} hadi 7ata 9dar Masar yt3arf 3la n9at l3afya.",
    fr: "Écrivez une brève explication de ce que vous avez appris dans {title} pour aider Masar à repérer les points faibles.", es: "Escribe una breve explicación de lo que aprendiste en {title} para que Masar detecte los puntos débiles.", pt: "Escreva uma explicação breve do que você aprendeu em {title} para que o Masar identifique os pontos fracos.",
    it: "Scrivi una breve spiegazione di ciò che hai imparato in {title} così Masar può individuare i punti deboli.", de: "Schreibe eine kurze Erklärung zu dem, was du in {title} gelernt hast, damit Masar schwache Stellen erkennt."
  },
  practiceNextStep: {
    en: "Next step: explain the concept in your own words and then try the next lesson.", ar: "الخطوة التالية: اشرح المفهوم بكلماتك الخاصة ثم جرّب الدرس التالي.", ary: "Lkhata lttaliya: chra7 lmo3na bkalimatek w ba3d jreb dars lttali.",
    fr: "Étape suivante : expliquez le concept avec vos propres mots, puis passez à la leçon suivante.", es: "Siguiente paso: explica el concepto con tus propias palabras y luego prueba la siguiente lección.", pt: "Próximo passo: explique o conceito com suas próprias palavras e depois tente a próxima lição.",
    it: "Prossimo passo: spiega il concetto con parole tue e poi prova la lezione successiva.", de: "Nächster Schritt: Erkläre das Konzept mit deinen eigenen Worten und mache dann die nächste Lektion."
  },
  practiceNeedsMore: {
    en: "Needs more depth", ar: "يحتاج إلى عمق أكبر", ary: "Y7taj l3umq akthar",
    fr: "Besoin de plus de profondeur", es: "Necesita más profundidad", pt: "Precisa de mais profundidade",
    it: "Serve più profondità", de: "Braucht mehr Tiefe"
  },
  practiceNeedsMoreDetail: {
    en: "Your explanation is short. Add one concrete example and one mistake to avoid in {title}.", ar: "شرحك قصير. أضف مثالًا محددًا وخطأً واحدًا لتتجنبه في {title}.", ary: "Chra7ek qasir. Ziz 7aja m3ayna w ghalta wa7da tkhtariha f {title}.",
    fr: "Votre explication est courte. Ajoutez un exemple concret et une erreur à éviter dans {title}.", es: "Tu explicación es breve. Añade un ejemplo concreto y un error que evitar en {title}", pt: "Sua explicação é curta. Adicione um exemplo concreto e um erro a evitar em {title}.",
    it: "La tua spiegazione è breve. Aggiungi un esempio concreto e un errore da evitare in {title}.", de: "Deine Erklärung ist kurz. Füge ein konkretes Beispiel und einen Fehler hinzu, den du in {title} vermeiden solltest."
  },
  practiceStrong: {
    en: "Looks solid", ar: "يبدو قويًا", ary: "Ybda qawi",
    fr: "Ça a l’air solide", es: "Parece sólido", pt: "Parece sólido",
    it: "Sembra solido", de: "Sieht solide aus"
  },
  practiceStrongDetail: {
    en: "You have explained the concept in {title}. Review it once more and turn it into a mini checklist.", ar: "لقد شرحت المفهوم في {title}. راجعها مرة أخرى وحوّلها إلى قائمة قصيرة من النقاط.", ary: "Qd chra7ti lmo3na f {title}. Rja3ha mara okhra w7awwlha lqayma sghira mn lnouqat.",
    fr: "Vous avez expliqué le concept dans {title}. Revoyez-le une fois et transformez-le en mini liste de vérification.", es: "Has explicado el concepto en {title}. Revísalo otra vez y conviértelo en una mini lista de comprobación.", pt: "Você explicou o conceito em {title}. Revise-o mais uma vez e transforme em uma mini checklist.",
    it: "Hai spiegato il concetto in {title}. Rivedilo ancora una volta e trasformalo in una mini checklist.", de: "Du hast das Konzept in {title} erklärt. Überprüfe es noch einmal und formuliere daraus eine Mini-Checkliste."
  },
  challengeTitle: {
    en: "Adaptive challenge", ar: "تحدٍ مُكيف", ary: "T7adi m3wwej",
    fr: "Défi adapté", es: "Reto adaptativo", pt: "Desafio adaptativo",
    it: "Sfida adattiva", de: "Adaptive Herausforderung"
  },
  challengeDifficulty: {
    en: "Difficulty", ar: "الصعوبة", ary: "S3uba",
    fr: "Difficulté", es: "Dificultad", pt: "Dificuldade",
    it: "Difficoltà", de: "Schwierigkeit"
  },
  challengeSkills: {
    en: "Skills tested", ar: "المهارات المختبرة", ary: "Lmaharat lmt7nna",
    fr: "Compétences testées", es: "Habilidades evaluadas", pt: "Habilidades testadas",
    it: "Competenze testate", de: "Geprüfte Fähigkeiten"
  },
  challengeObjective: {
    en: "Apply {title} in a realistic scenario at a {level} level.", ar: "طبّق {title} في سيناريو واقعي على مستوى {level}.", ary: "T9eb {title} f ssenario waqi3i 3la mstawa {level}.",
    fr: "Appliquez {title} dans un scénario réaliste au niveau {level}.", es: "Aplica {title} en un escenario realista a nivel {level}.", pt: "Aplique {title} em um cenário realista no nível {level}.",
    it: "Applica {title} in uno scenario realistico a livello {level}.", de: "Wende {title} in einem realistischen Szenario auf Niveau {level} an."
  },
  challengeScenario: {
    en: "Build a short outcome, solve a constraint, and explain why your approach works.", ar: "أنشئ نتيجة قصيرة، وحلّ قيدًا محددًا، وفسّر سبب نجاح نهجك.", ary: "Y3awn lktba m3awna, 7ll qaid qadim, w5rajer liya 3la 7ssab lahja dyalek.",
    fr: "Créez un résultat court, résolvez une contrainte et expliquez pourquoi votre approche fonctionne.", es: "Crea un resultado breve, resuelve una restricción y explica por qué tu enfoque funciona.", pt: "Crie um resultado curto, resolva uma restrição e explique por que sua abordagem funciona.",
    it: "Crea un risultato breve, risolvi un vincolo e spiega perché il tuo approccio funziona.", de: "Erstelle ein kurzes Ergebnis, löse eine Einschränkung und erkläre, warum dein Ansatz funktioniert."
  },
  challengeExpert: { en: "Expert", ar: "خبير", ary: "Khabir", fr: "Expert", es: "Experto", pt: "Especialista", it: "Esperto", de: "Experte" },
  challengeAdvanced: { en: "Advanced", ar: "متقدم", ary: "Mta9addem", fr: "Avancé", es: "Avanzado", pt: "Avançado", it: "Avanzato", de: "Fortgeschritten" },
  challengeIntermediate: { en: "Intermediate", ar: "متوسط", ary: "Moutawassit", fr: "Intermédiaire", es: "Intermedio", pt: "Intermediário", it: "Intermedio", de: "Mittelstufe" },
  challengeBeginner: { en: "Beginner", ar: "مبتدئ", ary: "Mobtadi", fr: "Débutant", es: "Principiante", pt: "Iniciante", it: "Principiante", de: "Anfänger" },
  projectTitle: {
    en: "Project-ready evidence", ar: "أدلة جاهزة للمشروع", ary: "Adella jhiza lmochro3",
    fr: "Preuves prêtes pour le projet", es: "Evidencia lista para el proyecto", pt: "Evidência pronta para o projeto",
    it: "Prove pronte per il progetto", de: "Projektfertige Evidenz"
  },
  projectObjective: {
    en: "Objective", ar: "الهدف", ary: "Lhadaf",
    fr: "Objectif", es: "Objetivo", pt: "Objetivo",
    it: "Obiettivo", de: "Ziel"
  },
  projectContext: {
    en: "Context", ar: "السياق", ary: "Siyaq",
    fr: "Contexte", es: "Contexto", pt: "Contexto",
    it: "Contesto", de: "Kontext"
  },
  projectRequirements: {
    en: "Requirements", ar: "المتطلبات", ary: "Lmutatlabat",
    fr: "Exigences", es: "Requisitos", pt: "Requisitos",
    it: "Requisiti", de: "Anforderungen"
  },
  projectConstraints: {
    en: "Constraints", ar: "القيود", ary: "Lqiyoud",
    fr: "Contraintes", es: "Restricciones", pt: "Restrições",
    it: "Vincoli", de: "Einschränkungen"
  },
  projectEvaluation: {
    en: "Projected evaluation", ar: "تقييم تقديري", ary: "Taqyim ttqdiri",
    fr: "Évaluation projetée", es: "Evaluación proyectada", pt: "Avaliação projetada",
    it: "Valutazione stimata", de: "Prognostische Bewertung"
  },
  projectEvidence: {
    en: "Skill evidence", ar: "أدلة المهارة", ary: "Adella lmaharat",
    fr: "Preuves de compétence", es: "Evidencia de habilidad", pt: "Evidência de habilidade",
    it: "Prove di competenza", de: "Kompetenznachweis"
  },
  evidenceTitle: {
    en: "Skill evidence", ar: "أدلة المهارة", ary: "Adella lmaharat",
    fr: "Preuves de compétence", es: "Evidencia de habilidad", pt: "Evidência de habilidade",
    it: "Prove di competenza", de: "Kompetenznachweis"
  },
  evidenceLessons: {
    en: "Lessons completed", ar: "الدروس المكتملة", ary: "Ldrous lkmilta",
    fr: "Leçons terminées", es: "Lecciones completadas", pt: "Lições concluídas",
    it: "Lezioni completate", de: "Abgeschlossene Lektionen"
  },
  evidencePractice: {
    en: "Practice notes", ar: "ملاحظات التطبيق", ary: "Mouhadharat ttatbi9",
    fr: "Notes de pratique", es: "Notas de práctica", pt: "Notas de prática",
    it: "Note di pratica", de: "Übungsnotizen"
  },
  evidenceChallenges: {
    en: "Challenges", ar: "التحديات", ary: "T7adiyat",
    fr: "Défis", es: "Retos", pt: "Desafios",
    it: "Sfide", de: "Herausforderungen"
  },
  evidenceProjects: {
    en: "Projects", ar: "المشاريع", ary: "Lmochro3at",
    fr: "Projets", es: "Proyectos", pt: "Projetos",
    it: "Progetti", de: "Projekte"
  },
  evidenceAssessment: {
    en: "Assessment estimate", ar: "تقدير التقييم", ary: "Taqdir ltaqyim",
    fr: "Estimation de l’évaluation", es: "Estimación de evaluación", pt: "Estimativa de avaliação",
    it: "Stima della valutazione", de: "Beurteilungsabschätzung"
  },
  evidenceRecent: {
    en: "Recent performance", ar: "الأداء الأخير", ary: "L3mal llakhir",
    fr: "Performance récente", es: "Rendimiento reciente", pt: "Desempenho recente",
    it: "Prestazione recente", de: "Aktuelle Leistung"
  },
  evidenceStrong: {
    en: "Strong recent performance", ar: "أداء قوي في الآونة الأخيرة", ary: "3mal qawi f l3a9a lakhirra",
    fr: "Bonne performance récente", es: "Rendimiento reciente sólido", pt: "Desempenho recente forte",
    it: "Prestazione recente solida", de: "Starke aktuelle Leistung"
  },
  evidenceDeveloping: {
    en: "Needs more guided practice", ar: "يحتاج إلى مزيد من التطبيق الموجه", ary: "Y7taj ll3mala bzzaf",
    fr: "Besoin de plus de pratique guidée", es: "Necesita más práctica guiada", pt: "Precisa de mais prática guiada",
    it: "Serve più pratica guidata", de: "Braucht mehr gezielte Übung"
  },
  evidenceBeginning: {
    en: "Just getting started", ar: "يبدأ فقط", ary: "Bda b7a9a",
    fr: "Vient de commencer", es: "Acaba de empezar", pt: "Acabou de começar",
    it: "Appena iniziato", de: "Gerade erst begonnen"
  },
  evidenceLabel: {
    en: "Evidence snapshot", ar: "لمحة عن الأدلة", ary: "Lmhah 3an ladella",
    fr: "Aperçu des preuves", es: "Vista previa de la evidencia", pt: "Resumo da evidência",
    it: "Anteprima delle prove", de: "Evidenz-Übersicht"
  },
  proofLabel: {
    en: "Proof", ar: "دليل", ary: "Daleel",
    fr: "Preuve", es: "Prueba", pt: "Prova",
    it: "Prova", de: "Beweis"
  },

  // ===== Extended exercises (true/false, fill-blank, ordering, matching) =====
  exerciseTrueFalseLabel: { en: "True or false", ar: "صح أم خطأ", ary: "S7i7 wla ghalet", fr: "Vrai ou faux", es: "Verdadero o falso", pt: "Verdadeiro ou falso", it: "Vero o falso", de: "Wahr oder falsch" },
  exerciseTrue: { en: "True", ar: "صح", ary: "S7i7", fr: "Vrai", es: "Verdadero", pt: "Verdadeiro", it: "Vero", de: "Wahr" },
  exerciseFalse: { en: "False", ar: "خطأ", ary: "Ghalet", fr: "Faux", es: "Falso", pt: "Falso", it: "Falso", de: "Falsch" },
  exerciseFillBlankLabel: { en: "Fill in the blank", ar: "أكمل الفراغ", ary: "Kmmel lfaragh", fr: "Complétez le vide", es: "Completa el espacio", pt: "Complete a lacuna", it: "Completa lo spazio", de: "Lücke ausfüllen" },
  exerciseFillBlankPlaceholder: { en: "Type your answer...", ar: "اكتب إجابتك...", ary: "Kteb jjawab dyalek...", fr: "Tapez votre réponse...", es: "Escribe tu respuesta...", pt: "Digite sua resposta...", it: "Scrivi la tua risposta...", de: "Gib deine Antwort ein..." },
  exerciseCheckAnswer: { en: "Check answer", ar: "تحقق من الإجابة", ary: "Tt7a99a9 mn jjawab", fr: "Vérifier la réponse", es: "Comprobar respuesta", pt: "Verificar resposta", it: "Verifica risposta", de: "Antwort prüfen" },
  exerciseOrderingLabel: { en: "Put in the right order", ar: "رتّب بالترتيب الصحيح", ary: "Retteb b ttartib ssa7i7", fr: "Remettez dans l'ordre", es: "Ordena correctamente", pt: "Coloque na ordem certa", it: "Metti nell'ordine giusto", de: "In die richtige Reihenfolge bringen" },
  exerciseMatchingLabel: { en: "Match the pairs", ar: "طابق بين الأزواج", ary: "Tabe9 bin ttnayen", fr: "Associez les paires", es: "Empareja los elementos", pt: "Combine os pares", it: "Abbina le coppie", de: "Paare zuordnen" },
  exerciseScenarioLabel: { en: "What would you do?", ar: "ماذا ستفعل؟", ary: "Ach ghadi ddir?", fr: "Que feriez-vous ?", es: "¿Qué harías?", pt: "O que você faria?", it: "Cosa faresti?", de: "Was würdest du tun?" },

  // ===== Project workspace & library =====
  projectOpenWorkspace: { en: "Open project workspace", ar: "افتح مساحة عمل المشروع", ary: "7ell l-workspace dyal mochro3", fr: "Ouvrir l'espace de projet", es: "Abrir espacio de trabajo", pt: "Abrir espaço do projeto", it: "Apri lo spazio progetto", de: "Projektarbeitsbereich öffnen" },
  workspaceIntro: { en: "Describe what you built, add a link if you have one, and check off what you completed.", ar: "صف ما بنيته، أضف رابطًا إن وجد، وأشّر ما أنجزته.", ary: "Wsef ach bnayti, zid link ila 3andek, w 3ayen ach kmmelti.", fr: "Décrivez ce que vous avez construit, ajoutez un lien si vous en avez un, et cochez ce que vous avez terminé.", es: "Describe lo que construiste, añade un enlace si tienes uno, y marca lo que completaste.", pt: "Descreva o que você construiu, adicione um link se tiver, e marque o que concluiu.", it: "Descrivi cosa hai costruito, aggiungi un link se ne hai uno, e spunta cosa hai completato.", de: "Beschreibe, was du gebaut hast, füge einen Link hinzu, falls vorhanden, und hake ab, was du erledigt hast." },
  workspaceLinkLabel: { en: "Project link (optional)", ar: "رابط المشروع (اختياري)", ary: "Link dyal mochro3 (ikhtiyari)", fr: "Lien du projet (facultatif)", es: "Enlace del proyecto (opcional)", pt: "Link do projeto (opcional)", it: "Link del progetto (opzionale)", de: "Projektlink (optional)" },
  workspaceDescLabel: { en: "What did you build?", ar: "ماذا بنيت؟", ary: "Ach bnayti?", fr: "Qu'avez-vous construit ?", es: "¿Qué construiste?", pt: "O que você construiu?", it: "Cosa hai costruito?", de: "Was hast du gebaut?" },
  workspaceChecklistTitle: { en: "Requirements", ar: "المتطلبات", ary: "Lmutatlabat", fr: "Exigences", es: "Requisitos", pt: "Requisitos", it: "Requisiti", de: "Anforderungen" },
  workspaceInvalidLink: { en: "Use a valid http(s) project link.", ar: "استخدم رابط مشروع صالحًا يبدأ بـ http أو https.", ary: "Sta3mel lien s7i7 kaybda b http wla https.", fr: "Utilisez un lien de projet valide en http(s).", es: "Usa un enlace de proyecto válido en http(s).", pt: "Use um link de projeto válido em http(s).", it: "Usa un link di progetto valido in http(s).", de: "Verwende einen gültigen http(s)-Projektlink." },
  workspaceFinishLessonsFirst: { en: "Finish all lessons in this skill before submitting the project.", ar: "أكمل جميع دروس هذه المهارة قبل تسليم المشروع.", ary: "Kmel ga3 doros dyal had skill 9bel ma tsift l-project.", fr: "Terminez tous les cours de cette compétence avant de soumettre le projet.", es: "Completa todas las lecciones de esta habilidad antes de enviar el proyecto.", pt: "Conclua todas as lições desta habilidade antes de enviar o projeto.", it: "Completa tutte le lezioni di questa competenza prima di inviare il progetto.", de: "Schließe alle Lektionen dieser Fähigkeit ab, bevor du das Projekt einreichst." },
  workspaceCompleteChecklistFirst: { en: "Complete every project requirement before submitting.", ar: "أكمل جميع متطلبات المشروع قبل التسليم.", ary: "Kmel ga3 talab dyal project 9bel ma tsiftou.", fr: "Complétez toutes les exigences du projet avant de soumettre.", es: "Completa todos los requisitos del proyecto antes de enviarlo.", pt: "Conclua todos os requisitos do projeto antes de enviar.", it: "Completa tutti i requisiti del progetto prima di inviarlo.", de: "Erfülle alle Projektanforderungen vor der Abgabe." },
  workspaceSubmitBtn: { en: "Mark project as submitted", ar: "أشّر المشروع كمُنجَز", ary: "3ayen mochro3 b7al mssalem", fr: "Marquer le projet comme soumis", es: "Marcar proyecto como enviado", pt: "Marcar projeto como enviado", it: "Segna il progetto come inviato", de: "Projekt als eingereicht markieren" },
  workspaceEditBtn: { en: "Edit submission", ar: "تعديل الإنجاز", ary: "Beddel li 9dmti", fr: "Modifier la soumission", es: "Editar entrega", pt: "Editar envio", it: "Modifica invio", de: "Einreichung bearbeiten" },
  workspaceSubmittedOn: { en: "Submitted on {date}", ar: "تم الإنجاز بتاريخ {date}", ary: "Ttsallem f {date}", fr: "Soumis le {date}", es: "Enviado el {date}", pt: "Enviado em {date}", it: "Inviato il {date}", de: "Eingereicht am {date}" },
  workspaceShareCommunityBtn: { en: "Share to community", ar: "شارك في المجتمع", ary: "Partagi f l-mojtama3", fr: "Partager avec la communauté", es: "Compartir con la comunidad", pt: "Compartilhar com a comunidade", it: "Condividi con la community", de: "Mit der Community teilen" },
  workspaceSharedAlready: { en: "Already shared to community", ar: "تمت مشاركته في المجتمع بالفعل", ary: "Ttpartagat f l-mojtama3 mnn9bel", fr: "Déjà partagé avec la communauté", es: "Ya compartido con la comunidad", pt: "Já compartilhado com a comunidade", it: "Già condiviso con la community", de: "Bereits mit der Community geteilt" },
  projectLibraryTitle: { en: "Project library", ar: "مكتبة المشاريع", ary: "Maktabat lmachari3", fr: "Bibliothèque de projets", es: "Biblioteca de proyectos", pt: "Biblioteca de projetos", it: "Libreria progetti", de: "Projektbibliothek" },
  projectLibraryEmpty: { en: "Complete a track's lessons to unlock its real-world project here.", ar: "أكمل دروس مسار لفتح مشروعه الواقعي هنا.", ary: "Kmmel dorous dyal massar bach t7ell mochro3o hna.", fr: "Terminez les leçons d'un parcours pour débloquer son projet ici.", es: "Completa las lecciones de una ruta para desbloquear su proyecto aquí.", pt: "Complete as lições de uma trilha para desbloquear seu projeto aqui.", it: "Completa le lezioni di un percorso per sbloccare il suo progetto qui.", de: "Schließe die Lektionen eines Kurses ab, um sein Projekt hier freizuschalten." },
  projectLibraryStatusSubmitted: { en: "Submitted", ar: "مُنجَز", ary: "Mssalem", fr: "Soumis", es: "Enviado", pt: "Enviado", it: "Inviato", de: "Eingereicht" },
  projectLibraryStatusReady: { en: "Ready to start", ar: "جاهز للبدء", ary: "Wajed bach tebda", fr: "Prêt à démarrer", es: "Listo para empezar", pt: "Pronto para começar", it: "Pronto per iniziare", de: "Bereit zum Start" },
  projectLibraryStatusLocked: { en: "Finish the lessons first", ar: "أنهِ الدروس أولًا", ary: "Sali dorous lawal", fr: "Terminez d'abord les leçons", es: "Termina primero las lecciones", pt: "Termine as lições primeiro", it: "Prima completa le lezioni", de: "Erst die Lektionen abschließen" },

  // ===== Skill explorer =====
  skillExplorerTitle: { en: "Skill explorer", ar: "مستكشف المهارات", ary: "Mostakchef lmaharat", fr: "Explorateur de compétences", es: "Explorador de habilidades", pt: "Explorador de habilidades", it: "Esploratore di competenze", de: "Fähigkeiten-Explorer" },
  skillExplorerIntro: { en: "Every track on Masar, with what leads into it and what it unlocks next.", ar: "كل مسار في مسار، مع ما يؤدي إليه وما يفتحه لاحقًا.", ary: "Kol massar f Masar, m3a ach kaywaddi lih w ach kayhell mn ba3do.", fr: "Chaque parcours de Masar, avec ce qui y mène et ce qu'il débloque ensuite.", es: "Cada ruta de Masar, con lo que lleva a ella y lo que desbloquea después.", pt: "Cada trilha do Masar, com o que leva a ela e o que ela desbloqueia depois.", it: "Ogni percorso di Masar, con ciò che vi conduce e ciò che sblocca dopo.", de: "Jeder Kurs bei Masar, mit dem, was zu ihm führt und was er als Nächstes freischaltet." },
  explorerPrereqLabel: { en: "Comes after", ar: "يأتي بعد", ary: "Kayji mn ba3d", fr: "Vient après", es: "Viene después de", pt: "Vem depois de", it: "Viene dopo", de: "Kommt nach" },
  explorerUnlocksLabel: { en: "Unlocks", ar: "يفتح", ary: "Kay7ell", fr: "Débloque", es: "Desbloquea", pt: "Desbloqueia", it: "Sblocca", de: "Schaltet frei" },
  explorerNoPrereq: { en: "Nothing required first", ar: "لا يتطلب شيئًا قبله", ary: "Ma khassou walo 9bel", fr: "Aucun prérequis", es: "Sin requisitos previos", pt: "Sem pré-requisitos", it: "Nessun prerequisito", de: "Keine Voraussetzung" },
  explorerNoUnlocks: { en: "A finishing skill in its area", ar: "مهارة ختامية في مجالها", ary: "Mahara khtamiya f majalha", fr: "Compétence terminale dans son domaine", es: "Habilidad final en su área", pt: "Habilidade final na sua área", it: "Competenza finale nella sua area", de: "Eine abschließende Fähigkeit in ihrem Bereich" },

  // ===== Community & public profile =====
  communityTitle: { en: "Community showcase", ar: "معرض المجتمع", ary: "M3rad l-mojtama3", fr: "Vitrine de la communauté", es: "Vitrina de la comunidad", pt: "Vitrine da comunidade", it: "Vetrina della community", de: "Community-Schaufenster" },
  communityIntro: { en: "Projects other learners chose to share publicly.", ar: "مشاريع اختار متعلمون آخرون مشاركتها علنًا.", ary: "Machari3 khtaro nnas okhrin ypartagiwhom b3lania.", fr: "Des projets que d'autres apprenants ont choisi de partager publiquement.", es: "Proyectos que otros estudiantes eligieron compartir públicamente.", pt: "Projetos que outros alunos escolheram compartilhar publicamente.", it: "Progetti che altri studenti hanno scelto di condividere pubblicamente.", de: "Projekte, die andere Lernende öffentlich geteilt haben." },
  communityEmpty: { en: "No shared projects yet, or community sync isn't set up. Be the first to share yours.", ar: "لا مشاريع مشتركة بعد، أو مزامنة المجتمع غير مفعّلة. كن أول من يشارك مشروعه.", ary: "Mazal ma kaynch machari3 mpartagiyin, wla community sync machi mfa33el. Kon awal wa7ed li ypartagi mochro3o.", fr: "Aucun projet partagé pour l'instant, ou la synchronisation communautaire n'est pas configurée. Soyez le premier à partager le vôtre.", es: "Aún no hay proyectos compartidos, o la sincronización comunitaria no está configurada. Sé el primero en compartir el tuyo.", pt: "Ainda não há projetos compartilhados, ou a sincronização da comunidade não está configurada. Seja o primeiro a compartilhar o seu.", it: "Nessun progetto condiviso ancora, o la sincronizzazione community non è configurata. Sii il primo a condividere il tuo.", de: "Noch keine geteilten Projekte, oder die Community-Synchronisierung ist nicht eingerichtet. Teile als Erster dein eigenes." },
  communitySignInRequired: { en: "Sign in to share your project with the community.", ar: "سجّل الدخول لمشاركة مشروعك مع المجتمع.", ary: "Sajel ddkhol bach tpartagi mochro3ek m3a l-mojtama3.", fr: "Connectez-vous pour partager votre projet avec la communauté.", es: "Inicia sesión para compartir tu proyecto con la comunidad.", pt: "Faça login para compartilhar seu projeto com a comunidade.", it: "Accedi per condividere il tuo progetto con la community.", de: "Melde dich an, um dein Projekt mit der Community zu teilen." },
  communityShareSuccess: { en: "Shared with the community!", ar: "تمت المشاركة مع المجتمع!", ary: "Ttpartaga m3a l-mojtama3!", fr: "Partagé avec la communauté !", es: "¡Compartido con la comunidad!", pt: "Compartilhado com a comunidade!", it: "Condiviso con la community!", de: "Mit der Community geteilt!" },
  communityShareError: { en: "Could not share right now. Try again later.", ar: "تعذّرت المشاركة الآن. حاول لاحقًا.", ary: "Ma 9dernach npartagiw daba. 3awed jarreb mn ba3d.", fr: "Impossible de partager pour le moment. Réessayez plus tard.", es: "No se pudo compartir ahora. Inténtalo más tarde.", pt: "Não foi possível compartilhar agora. Tente novamente mais tarde.", it: "Impossibile condividere ora. Riprova più tardi.", de: "Konnte gerade nicht geteilt werden. Versuche es später erneut." },
  publicProfileTitle: { en: "Public profile", ar: "الملف العام", ary: "Profil l3am", fr: "Profil public", es: "Perfil público", pt: "Perfil público", it: "Profilo pubblico", de: "Öffentliches Profil" },
  publicProfileSignInRequired: {
    en: "Sign in to make your profile public and get a shareable link.",
    ar: "سجّل الدخول لجعل ملفك عامًا والحصول على رابط قابل للمشاركة.",
    ary: "Sajel ddkhol bach ddir profil dyalek 3am w tjib link t9der tpartagih.",
    fr: "Connectez-vous pour rendre votre profil public et obtenir un lien à partager.",
    es: "Inicia sesión para hacer público tu perfil y obtener un enlace para compartir.",
    pt: "Faça login para tornar seu perfil público e obter um link para compartilhar.",
    it: "Accedi per rendere pubblico il tuo profilo e ottenere un link da condividere.",
    de: "Melde dich an, um dein Profil öffentlich zu machen und einen teilbaren Link zu erhalten."
  },
  publicProfileToggleLabel: { en: "Make my profile public", ar: "اجعل ملفي عامًا", ary: "Dir profil dyali 3am", fr: "Rendre mon profil public", es: "Hacer mi perfil público", pt: "Tornar meu perfil público", it: "Rendi pubblico il mio profilo", de: "Mein Profil öffentlich machen" },
  publicProfileEnabled: { en: "Your profile is public. Anyone with the link below can view it.", ar: "ملفك عام الآن. يمكن لأي شخص لديه الرابط أدناه مشاهدته.", ary: "Profil dyalek daba 3am. Ay wa7ed 3ando link ttahtani ymken ychoufo.", fr: "Votre profil est public. Toute personne ayant le lien ci-dessous peut le consulter.", es: "Tu perfil es público. Cualquiera con el enlace de abajo puede verlo.", pt: "Seu perfil é público. Qualquer pessoa com o link abaixo pode vê-lo.", it: "Il tuo profilo è pubblico. Chiunque abbia il link qui sotto può vederlo.", de: "Dein Profil ist öffentlich. Jeder mit dem untenstehenden Link kann es sehen." },
  publicProfileDisabled: { en: "Your profile is private.", ar: "ملفك خاص.", ary: "Profil dyalek khass.", fr: "Votre profil est privé.", es: "Tu perfil es privado.", pt: "Seu perfil é privado.", it: "Il tuo profilo è privato.", de: "Dein Profil ist privat." },
  publicProfileNotConfigured: { en: "Public profiles need account sync to be configured first (see auth-sync.js).", ar: "الملفات العامة تحتاج تفعيل مزامنة الحساب أولًا (انظر auth-sync.js).", ary: "Profils l3ammin khasshom sync dyal compte mfa33el lawal (chouf auth-sync.js).", fr: "Les profils publics nécessitent d'abord la configuration de la synchronisation de compte (voir auth-sync.js).", es: "Los perfiles públicos necesitan que la sincronización de cuenta esté configurada primero (ver auth-sync.js).", pt: "Perfis públicos precisam que a sincronização de conta esteja configurada primeiro (veja auth-sync.js).", it: "I profili pubblici richiedono prima la configurazione della sincronizzazione account (vedi auth-sync.js).", de: "Öffentliche Profile erfordern zuerst eine konfigurierte Kontosynchronisierung (siehe auth-sync.js)." },
  publicProfileCopyLink: { en: "Copy profile link", ar: "نسخ رابط الملف", ary: "Nsekh link dyal profil", fr: "Copier le lien du profil", es: "Copiar enlace del perfil", pt: "Copiar link do perfil", it: "Copia link del profilo", de: "Profillink kopieren" },
  publicProfileLinkCopied: { en: "Profile link copied.", ar: "تم نسخ رابط الملف.", ary: "Ttnsekh link dyal profil.", fr: "Lien du profil copié.", es: "Enlace del perfil copiado.", pt: "Link do perfil copiado.", it: "Link del profilo copiato.", de: "Profillink kopiert." },
  publicProfileNotFound: { en: "This profile is not public or does not exist.", ar: "هذا الملف غير عام أو غير موجود.", ary: "Had profil machi 3am wla machi mawjoud.", fr: "Ce profil n'est pas public ou n'existe pas.", es: "Este perfil no es público o no existe.", pt: "Este perfil não é público ou não existe.", it: "Questo profilo non è pubblico o non esiste.", de: "Dieses Profil ist nicht öffentlich oder existiert nicht." },
  publicProfileBackToApp: { en: "← Back to Masar", ar: "← عودة إلى مسار", ary: "<- Rje3 l Masar", fr: "← Retour à Masar", es: "← Volver a Masar", pt: "← Voltar ao Masar", it: "← Torna a Masar", de: "← Zurück zu Masar" },

  // =================================================================
  // إضافات مفاتيح مفقودة (كانت مُستعملة فعليًا فـ app.js/project-workspace.js
  // بلا أي تعريف فـ UI_STRINGS، فكانت تظهر كمفتاح خام بلا ترجمة —
  // مثل "assessmentTitle" حرفيًا بدل نص مترجم). اكتُشفت بمقارنة منهجية
  // بين كل استدعاءات t() الفعلية وهذا الملف. تتضمن أيضًا المفاتيح
  // الجديدة التي أضافتها هذه الجولة من التحسينات (§6 التحدي/المشروع فـ
  // الإتقان، §7 أيقونات المسار، §10 وقت التحدي، §11 تلميحات وأهداف
  // إضافية للمشروع، §18 جلسة 10 دقائق الحقيقية).
  // =================================================================

  // ----- Final assessment panel (كانت مفقودة بالكامل) -----
  assessmentTitle: { en: "Final assessment", ar: "الاختبار النهائي", ary: "Lekhtibar nnihai", fr: "Évaluation finale", es: "Evaluación final", pt: "Avaliação final", it: "Valutazione finale", de: "Abschlussprüfung" },
  assessmentIntro: { en: "Answer every question, then submit to see your real score.", ar: "أجب عن كل الأسئلة، ثم أرسل لترى نتيجتك الحقيقية.", ary: "Jaweb 3la gaa las2ila, mn ba3d sifet bach tchouf natijtek l7a9i9iya.", fr: "Répondez à toutes les questions, puis soumettez pour voir votre score réel.", es: "Responde todas las preguntas y envíalas para ver tu puntuación real.", pt: "Responda todas as perguntas e envie para ver sua pontuação real.", it: "Rispondi a tutte le domande, poi invia per vedere il tuo punteggio reale.", de: "Beantworte alle Fragen und sende sie ab, um dein echtes Ergebnis zu sehen." },
  assessmentQuestionOf: { en: "Question {current} of {total}", ar: "السؤال {current} من {total}", ary: "So2al {current} mn {total}", fr: "Question {current} sur {total}", es: "Pregunta {current} de {total}", pt: "Pergunta {current} de {total}", it: "Domanda {current} di {total}", de: "Frage {current} von {total}" },
  assessmentAnswerAllHint: { en: "Answer every question to enable submission.", ar: "أجب عن كل الأسئلة لتفعيل الإرسال.", ary: "Jaweb 3la gaa las2ila bach tfa33el ssifet.", fr: "Répondez à toutes les questions pour activer l'envoi.", es: "Responde todas las preguntas para poder enviar.", pt: "Responda todas as perguntas para habilitar o envio.", it: "Rispondi a tutte le domande per abilitare l'invio.", de: "Beantworte alle Fragen, um das Absenden zu aktivieren." },
  assessmentSubmit: { en: "Submit assessment", ar: "إرسال الاختبار", ary: "Sift lekhtibar", fr: "Soumettre l'évaluation", es: "Enviar evaluación", pt: "Enviar avaliação", it: "Invia valutazione", de: "Prüfung absenden" },
  assessmentPassed: { en: "Passed", ar: "ناجح", ary: "Najah", fr: "Réussi", es: "Aprobado", pt: "Aprovado", it: "Superato", de: "Bestanden" },
  assessmentFailed: { en: "Not passed yet", ar: "لم ينجح بعد", ary: "Mazal manjahch", fr: "Pas encore réussi", es: "Aún no aprobado", pt: "Ainda não aprovado", it: "Non ancora superato", de: "Noch nicht bestanden" },
  assessmentScoreLabel: { en: "Score", ar: "النتيجة", ary: "Natija", fr: "Score", es: "Puntuación", pt: "Pontuação", it: "Punteggio", de: "Ergebnis" },
  assessmentPassThreshold: { en: "Passing score: {pct}%", ar: "النسبة المطلوبة للنجاح: {pct}%", ary: "Nesba mtlouba llnajah: {pct}%", fr: "Score requis pour réussir : {pct}%", es: "Puntuación requerida: {pct}%", pt: "Pontuação necessária: {pct}%", it: "Punteggio richiesto: {pct}%", de: "Erforderliche Punktzahl: {pct}%" },
  assessmentCompletedOn: { en: "Completed on {date}", ar: "أُنجز بتاريخ {date}", ary: "Ttadi f {date}", fr: "Terminé le {date}", es: "Completado el {date}", pt: "Concluído em {date}", it: "Completato il {date}", de: "Abgeschlossen am {date}" },
  assessmentReviewCorrect: { en: "Correct", ar: "إجابة صحيحة", ary: "Jawab s7i7", fr: "Correct", es: "Correcto", pt: "Correto", it: "Corretto", de: "Richtig" },
  assessmentReviewIncorrect: { en: "Incorrect", ar: "إجابة خاطئة", ary: "Jawab ghalet", fr: "Incorrect", es: "Incorrecto", pt: "Incorreto", it: "Errato", de: "Falsch" },
  assessmentRetake: { en: "Retake assessment", ar: "إعادة الاختبار", ary: "3awed dir lekhtibar", fr: "Repasser l'évaluation", es: "Repetir evaluación", pt: "Refazer avaliação", it: "Ripeti valutazione", de: "Prüfung wiederholen" },
  assessmentNudgeForCertificate: { en: "Pass the final assessment to strengthen your certificate.", ar: "اجتز الاختبار النهائي لتعزيز شهادتك.", ary: "Njah f lekhtibar nnihai bach tqawwi chahadtek.", fr: "Réussissez l'évaluation finale pour renforcer votre certificat.", es: "Aprueba la evaluación final para reforzar tu certificado.", pt: "Passe na avaliação final para reforçar seu certificado.", it: "Supera la valutazione finale per rafforzare il tuo certificato.", de: "Bestehe die Abschlussprüfung, um dein Zertifikat zu stärken." },
  certificateAssessmentScoreLine: { en: "Final assessment: {pct}% ({status})", ar: "الاختبار النهائي: {pct}% ({status})", ary: "Lekhtibar nnihai: {pct}% ({status})", fr: "Évaluation finale : {pct}% ({status})", es: "Evaluación final: {pct}% ({status})", pt: "Avaliação final: {pct}% ({status})", it: "Valutazione finale: {pct}% ({status})", de: "Abschlussprüfung: {pct}% ({status})" },

  // ----- Masar Mentor panel (كانت مفقودة بالكامل) -----
  mentorTitle: { en: "Masar Mentor", ar: "مرشد مسار", ary: "Mourchid Masar", fr: "Mentor Masar", es: "Mentor Masar", pt: "Mentor Masar", it: "Mentore Masar", de: "Masar-Mentor" },
  mentorDisclaimer: { en: "Not an AI — a rule-based guide built on your real progress.", ar: "ليس ذكاءً اصطناعيًا — بل مرشد قائم على قواعد مبني على تقدمك الحقيقي.", ary: "Machi dakae isti3nai — ghir mourchid mbni 3la qawa3id w 3la tta9addom dyalek l7a9i9i.", fr: "Ce n'est pas une IA — un guide basé sur des règles et votre vraie progression.", es: "No es una IA — es una guía basada en reglas y tu progreso real.", pt: "Não é uma IA — é um guia baseado em regras e no seu progresso real.", it: "Non è un'IA — è una guida basata su regole e sui tuoi progressi reali.", de: "Keine KI — ein regelbasierter Leitfaden auf Basis deines echten Fortschritts." },
  mentorHintReview: { en: "Hint: something you learned is ready to be reviewed.", ar: "تلميح: شيء تعلمته أصبح جاهزًا للمراجعة.", ary: "Talmi7: chi 7aja t3llemtiha wjda l lmraja3a.", fr: "Indice : quelque chose que vous avez appris est prêt à être révisé.", es: "Pista: algo que aprendiste está listo para repasar.", pt: "Dica: algo que você aprendeu está pronto para revisão.", it: "Suggerimento: qualcosa che hai imparato è pronto per il ripasso.", de: "Hinweis: Etwas Gelerntes ist bereit zur Wiederholung." },
  mentorExplainReview: { en: "\"{title}\" is due for a quick review to keep it fresh in memory.", ar: "\"{title}\" مستحق لمراجعة سريعة للحفاظ عليه في الذاكرة.", ary: "\"{title}\" mstahq lmraja3a sari3a bach ybqa 7afed f dmagh.", fr: "\"{title}\" est à revoir rapidement pour rester frais en mémoire.", es: "\"{title}\" está pendiente de un repaso rápido para no olvidarlo.", pt: "\"{title}\" está pendente de uma revisão rápida para não esquecer.", it: "\"{title}\" è da ripassare rapidamente per non dimenticarlo.", de: "\"{title}\" ist fällig für eine kurze Wiederholung, damit es im Gedächtnis bleibt." },
  mentorActionReview: { en: "Review now", ar: "راجع الآن", ary: "Rja3 daba", fr: "Réviser maintenant", es: "Repasar ahora", pt: "Revisar agora", it: "Ripassa ora", de: "Jetzt wiederholen" },
  mentorHintWeakness: { en: "Hint: one concept in your current track still needs work.", ar: "تلميح: مفهوم واحد في مسارك الحالي لا يزال يحتاج إلى عمل.", ary: "Talmi7: mafhoum wa7ed f massarek l7ali mazal khasso khedma.", fr: "Indice : un concept de votre parcours actuel a encore besoin de travail.", es: "Pista: un concepto de tu ruta actual todavía necesita trabajo.", pt: "Dica: um conceito da sua trilha atual ainda precisa de trabalho.", it: "Suggerimento: un concetto del tuo percorso attuale necessita ancora di lavoro.", de: "Hinweis: Ein Konzept in deinem aktuellen Kurs braucht noch Arbeit." },
  mentorExplainWeakness: { en: "\"{title}\" — {reason}", ar: "\"{title}\" — {reason}", ary: "\"{title}\" — {reason}", fr: "\"{title}\" — {reason}", es: "\"{title}\" — {reason}", pt: "\"{title}\" — {reason}", it: "\"{title}\" — {reason}", de: "\"{title}\" — {reason}" },
  mentorActionWeakness: { en: "Work on it", ar: "اعمل عليه", ary: "Khdem 3lih", fr: "Y travailler", es: "Trabajarlo", pt: "Trabalhar nisso", it: "Lavoraci su", de: "Daran arbeiten" },
  mentorHintContinue: { en: "Hint: you're mid-way through a track. Momentum matters.", ar: "تلميح: أنت في منتصف مسار. الاستمرارية مهمة.", ary: "Talmi7: nta f wast massar. Momentum mohim.", fr: "Indice : vous êtes à mi-parcours. L'élan compte.", es: "Pista: estás a mitad de una ruta. El impulso importa.", pt: "Dica: você está no meio de uma trilha. O ritmo importa.", it: "Suggerimento: sei a metà percorso. Il ritmo conta.", de: "Hinweis: Du bist mitten in einem Kurs. Der Schwung zählt." },
  mentorExplainContinue: { en: "\"{title}\": {done} of {total} lessons done. One more keeps the streak alive.", ar: "\"{title}\": {done} من {total} دروس مكتملة. درس آخر يبقي السلسلة حية.", ary: "\"{title}\": {done} mn {total} dorous kmelt. Dars akhor kayhfed silsila.", fr: "\"{title}\" : {done} leçons sur {total} terminées. Une de plus maintient la série.", es: "\"{title}\": {done} de {total} lecciones hechas. Una más mantiene la racha.", pt: "\"{title}\": {done} de {total} lições feitas. Mais uma mantém a sequência.", it: "\"{title}\": {done} di {total} lezioni fatte. Un'altra mantiene la serie.", de: "\"{title}\": {done} von {total} Lektionen erledigt. Eine weitere hält die Serie am Leben." },
  mentorActionContinue: { en: "Continue this track", ar: "واصل هذا المسار", ary: "Kmmel had massar", fr: "Continuer ce parcours", es: "Continuar esta ruta", pt: "Continuar esta trilha", it: "Continua questo percorso", de: "Diesen Kurs fortsetzen" },
  mentorHintStart: { en: "Hint: the first lesson of any skill is the hardest one to begin.", ar: "تلميح: أول درس في أي مهارة هو الأصعب للبدء.", ary: "Talmi7: awal dars f ay mahara howa aseb bach tebda.", fr: "Indice : la première leçon d'une compétence est la plus difficile à commencer.", es: "Pista: la primera lección de cualquier habilidad es la más difícil de empezar.", pt: "Dica: a primeira lição de qualquer habilidade é a mais difícil de começar.", it: "Suggerimento: la prima lezione di ogni competenza è la più difficile da iniziare.", de: "Hinweis: Die erste Lektion einer Fähigkeit ist am schwersten zu beginnen." },
  mentorExplainStart: { en: "Pick any skill and complete just its first lesson today.", ar: "اختر أي مهارة وأكمل درسها الأول اليوم فقط.", ary: "Khtar ay mahara w kmmel ghi dars l-awal dyalha lyoum.", fr: "Choisissez une compétence et terminez juste sa première leçon aujourd'hui.", es: "Elige cualquier habilidad y completa solo su primera lección hoy.", pt: "Escolha qualquer habilidade e complete só a primeira lição hoje.", it: "Scegli una competenza e completa solo la sua prima lezione oggi.", de: "Wähle eine Fähigkeit und schließe heute nur die erste Lektion ab." },
  mentorActionStart: { en: "Start a skill", ar: "ابدأ مهارة", ary: "Bda mahara", fr: "Commencer une compétence", es: "Empezar una habilidad", pt: "Começar uma habilidade", it: "Inizia una competenza", de: "Fähigkeit beginnen" },

  // ----- Daily learning queue (كانت مفقودة بالكامل) -----
  dailyQueueTitle: { en: "Today's queue", ar: "قائمة اليوم", ary: "Qayma dyal lyoum", fr: "File du jour", es: "Cola de hoy", pt: "Fila de hoje", it: "Coda di oggi", de: "Heutige Warteschlange" },
  dailyQueueTitleWithBudget: { en: "Today's queue ({minutes} min)", ar: "قائمة اليوم ({minutes} د)", ary: "Qayma dyal lyoum ({minutes} d)", fr: "File du jour ({minutes} min)", es: "Cola de hoy ({minutes} min)", pt: "Fila de hoje ({minutes} min)", it: "Coda di oggi ({minutes} min)", de: "Heutige Warteschlange ({minutes} Min.)" },
  dailyQueueContinue: { en: "Continue \"{title}\"", ar: "واصل \"{title}\"", ary: "Kmmel \"{title}\"", fr: "Continuer \"{title}\"", es: "Continuar \"{title}\"", pt: "Continuar \"{title}\"", it: "Continua \"{title}\"", de: "\"{title}\" fortsetzen" },
  minutesShort: { en: "{minutes}m", ar: "{minutes}د", ary: "{minutes}d", fr: "{minutes}min", es: "{minutes}min", pt: "{minutes}min", it: "{minutes}min", de: "{minutes}Min." },

  // ----- Onboarding time-per-day question (كان الحقل موجودًا فـ HTML بلا ترجمة) -----
  onboardingTimeQuestion: { en: "How much time can you give per day?", ar: "كم من الوقت يمكنك تخصيصه يوميًا؟", ary: "Ch7al mn lwa9t t9der t3ti kol nhar?", fr: "Combien de temps pouvez-vous consacrer par jour ?", es: "¿Cuánto tiempo puedes dedicar al día?", pt: "Quanto tempo você pode dedicar por dia?", it: "Quanto tempo puoi dedicare ogni giorno?", de: "Wie viel Zeit kannst du täglich aufbringen?" },
  timePerDayOption: { en: "{minutes} minutes/day", ar: "{minutes} دقيقة/يوم", ary: "{minutes} d9i9a/nhar", fr: "{minutes} minutes/jour", es: "{minutes} minutos/día", pt: "{minutes} minutos/dia", it: "{minutes} minuti/giorno", de: "{minutes} Minuten/Tag" },

  // ----- Learning Paths titles/labels (كانت مفقودة بالكامل) -----
  pathsTitle: { en: "Learning paths", ar: "المسارات المهنية", ary: "Lmassarat lmihaniya", fr: "Parcours d'apprentissage", es: "Rutas de aprendizaje", pt: "Trilhas de aprendizagem", it: "Percorsi di apprendimento", de: "Lernpfade" },
  pathFinished: { en: "Path completed", ar: "اكتمل المسار", ary: "Kmel massar", fr: "Parcours terminé", es: "Ruta completada", pt: "Trilha concluída", it: "Percorso completato", de: "Pfad abgeschlossen" },
  pathProgressLabel: { en: "{pct}% complete", ar: "اكتمل {pct}%", ary: "Kmel {pct}%", fr: "{pct}% terminé", es: "{pct}% completado", pt: "{pct}% concluído", it: "{pct}% completato", de: "{pct}% abgeschlossen" },
  pathStepDone: { en: "Completed", ar: "مكتمل", ary: "Kmel", fr: "Terminé", es: "Completado", pt: "Concluído", it: "Completato", de: "Abgeschlossen" },
  pathStepLocked: { en: "Previous step not finished yet (you can still open it)", ar: "الخطوة السابقة لم تكتمل بعد (يمكنك فتحها رغم ذلك)", ary: "Lkhotwa lsba9a mazal makmletch (t9der t7elha b7al ma bghiti)", fr: "Étape précédente non terminée (vous pouvez quand même l'ouvrir)", es: "Paso anterior sin terminar (puedes abrirlo igualmente)", pt: "Etapa anterior não concluída (você ainda pode abri-la)", it: "Passo precedente non completato (puoi comunque aprirlo)", de: "Vorheriger Schritt noch nicht abgeschlossen (du kannst ihn trotzdem öffnen)" },
  pathStepReady: { en: "Ready to start", ar: "جاهز للبدء", ary: "Wajed bach tebda", fr: "Prêt à démarrer", es: "Listo para empezar", pt: "Pronto para começar", it: "Pronto per iniziare", de: "Bereit zum Start" },

  // ----- Portfolio skills list section title (كان مفقودًا) -----
  portfolioSkillsTitle: { en: "Skills breakdown", ar: "تفصيل المهارات", ary: "Tafsil lmaharat", fr: "Détail des compétences", es: "Desglose de habilidades", pt: "Detalhamento de habilidades", it: "Dettaglio delle competenze", de: "Aufschlüsselung der Fähigkeiten" },

  // ----- Project evaluation disclaimer (كان مفقودًا) -----
  projectEvaluationDisclaimer: { en: "Self-estimate only, not a graded evaluation — there is no automated grading system.", ar: "تقدير ذاتي فقط، وليس تقييمًا مصححًا — لا يوجد نظام تصحيح آلي.", ary: "Taqdir dhati bark, machi taqyim mssa7e7 — makaynch système dyal ttas7i7 automatique.", fr: "Estimation personnelle uniquement, pas une évaluation notée — il n'existe pas de système de notation automatique.", es: "Solo una autoestimación, no una evaluación calificada — no existe un sistema de calificación automática.", pt: "Apenas uma autoavaliação, não uma avaliação corrigida — não há sistema de correção automática.", it: "Solo un'autovalutazione, non una valutazione corretta — non esiste un sistema di correzione automatica.", de: "Nur eine Selbsteinschätzung, keine bewertete Prüfung — es gibt kein automatisches Bewertungssystem." },
  challengeSolved: { en: "Solved", ar: "مُنجَز", ary: "Ttssala", fr: "Résolu", es: "Resuelto", pt: "Resolvido", it: "Risolto", de: "Gelöst" },

  // ----- §6: mastery now includes challenge/project evidence -----
  masteryChallengeLabel: { en: "Challenge", ar: "التحدي", ary: "T7adi", fr: "Défi", es: "Reto", pt: "Desafio", it: "Sfida", de: "Herausforderung" },
  masteryProjectLabel: { en: "Project", ar: "المشروع", ary: "Mochro3", fr: "Projet", es: "Proyecto", pt: "Projeto", it: "Progetto", de: "Projekt" },
  masteryExplain: {
    en: "Knowledge {knowledge}% + Practice {practice}% + Challenge {challenge}% + Project {project}%, weighted 35/25/20/20.",
    ar: "المعرفة {knowledge}% + التطبيق {practice}% + التحدي {challenge}% + المشروع {project}%، بأوزان 35/25/20/20.",
    ary: "Lma3rifa {knowledge}% + Ttatbi9 {practice}% + T7adi {challenge}% + Mochro3 {project}%, b awzan 35/25/20/20.",
    fr: "Connaissance {knowledge}% + Pratique {practice}% + Défi {challenge}% + Projet {project}%, pondérés 35/25/20/20.",
    es: "Conocimiento {knowledge}% + Práctica {practice}% + Reto {challenge}% + Proyecto {project}%, ponderados 35/25/20/20.",
    pt: "Conhecimento {knowledge}% + Prática {practice}% + Desafio {challenge}% + Projeto {project}%, ponderados 35/25/20/20.",
    it: "Conoscenza {knowledge}% + Pratica {practice}% + Sfida {challenge}% + Progetto {project}%, pesati 35/25/20/20.",
    de: "Wissen {knowledge}% + Übung {practice}% + Herausforderung {challenge}% + Projekt {project}%, gewichtet 35/25/20/20."
  },

  // ----- §10: challenge estimated time -----
  challengeEstimatedTime: { en: "Estimated time", ar: "الوقت المقدر", ary: "Lwa9t ttaqriri", fr: "Temps estimé", es: "Tiempo estimado", pt: "Tempo estimado", it: "Tempo stimato", de: "Geschätzte Zeit" },

  // ----- §11: project hints, resources, stretch goals -----
  projectShowHints: { en: "Show a hint", ar: "أظهر تلميحًا", ary: "Wri talmi7", fr: "Afficher un indice", es: "Mostrar una pista", pt: "Mostrar uma dica", it: "Mostra un suggerimento", de: "Hinweis anzeigen" },
  projectHideHints: { en: "Hide hints", ar: "إخفاء التلميحات", ary: "Khbi ttalmi7at", fr: "Masquer les indices", es: "Ocultar pistas", pt: "Ocultar dicas", it: "Nascondi suggerimenti", de: "Hinweise ausblenden" },
  projectStretchGoals: { en: "Stretch goals (optional)", ar: "أهداف إضافية (اختيارية)", ary: "Ahdaf zayda (ikhtiyariya)", fr: "Objectifs bonus (facultatifs)", es: "Metas adicionales (opcionales)", pt: "Metas extras (opcionais)", it: "Obiettivi extra (facoltativi)", de: "Zusatzziele (optional)" },
  projectStretchGoal: { en: "Also apply what you learned in \"{title}\" to make the project more complete.", ar: "طبّق أيضًا ما تعلمته في \"{title}\" لجعل المشروع أكثر اكتمالًا.", ary: "T9eb ossi ach t3llemti f \"{title}\" bach ddir mochro3 akmel.", fr: "Appliquez aussi ce que vous avez appris dans \"{title}\" pour un projet plus complet.", es: "Aplica también lo aprendido en \"{title}\" para un proyecto más completo.", pt: "Aplique também o que aprendeu em \"{title}\" para um projeto mais completo.", it: "Applica anche ciò che hai imparato in \"{title}\" per un progetto più completo.", de: "Wende auch das in \"{title}\" Gelernte an, um das Projekt vollständiger zu machen." },

  // ----- §18: real 10-minute session stages -----
  tenMinuteStagesIntro: { en: "A real {minutes}-minute plan, broken into stages:", ar: "خطة حقيقية مدتها {minutes} دقيقة، مقسمة إلى مراحل:", ary: "Khetta 7a9i9iya dyal {minutes} d9ay9, mqasma l marahil:", fr: "Un vrai plan de {minutes} minutes, en plusieurs étapes :", es: "Un plan real de {minutes} minutos, dividido en etapas:", pt: "Um plano real de {minutes} minutos, dividido em etapas:", it: "Un piano reale di {minutes} minuti, diviso in fasi:", de: "Ein echter {minutes}-Minuten-Plan, in Etappen unterteilt:" },
  tenMinuteStageLearn: { en: "Learn", ar: "تعلّم", ary: "T3allem", fr: "Apprendre", es: "Aprender", pt: "Aprender", it: "Impara", de: "Lernen" },
  tenMinuteStageExample: { en: "Example", ar: "مثال", ary: "Mital", fr: "Exemple", es: "Ejemplo", pt: "Exemplo", it: "Esempio", de: "Beispiel" },
  tenMinuteStagePractice: { en: "Practice", ar: "تطبيق", ary: "Ttatbi9", fr: "Pratique", es: "Práctica", pt: "Prática", it: "Pratica", de: "Übung" },
  tenMinuteStageChallenge: { en: "Challenge", ar: "تحدٍ", ary: "T7adi", fr: "Défi", es: "Reto", pt: "Desafio", it: "Sfida", de: "Herausforderung" },
  tenMinuteStart: { en: "Start this session", ar: "ابدأ هذه الجلسة", ary: "Bda had ssession", fr: "Démarrer cette session", es: "Iniciar esta sesión", pt: "Iniciar esta sessão", it: "Inizia questa sessione", de: "Diese Sitzung starten" },

  // ===================================================================
  // لوحة مقاييس المنتج (Product Metrics Dashboard) — metrics-dashboard.js
  // ===================================================================
  metricsDashboardTitle: { en: "Product metrics", ar: "مقاييس المنتج", ary: "Mqayis lproduit", fr: "Métriques produit", es: "Métricas del producto", pt: "Métricas do produto", it: "Metriche del prodotto", de: "Produktkennzahlen" },
  metricsDisclaimer: { en: "These numbers are computed locally on this device only, from your own activity. There is no server-side aggregation across users.", ar: "هذه الأرقام تُحسب محليًا على هذا الجهاز فقط، من نشاطك الخاص. لا يوجد تجميع على خادم عبر مستخدمين آخرين.", ary: "Had l-ar9am kaythesbo mo7alliyan f had l-jihaz bark, mn nachat dyalek nta. Makaynch tajmi3 f server bin l-mosta3milin.", fr: "Ces chiffres sont calculés localement sur cet appareil uniquement, à partir de votre propre activité. Il n'y a pas d'agrégation côté serveur entre utilisateurs.", es: "Estas cifras se calculan localmente solo en este dispositivo, a partir de tu propia actividad. No hay agregación en servidor entre usuarios.", pt: "Esses números são calculados localmente apenas neste dispositivo, a partir da sua própria atividade. Não há agregação no servidor entre usuários.", it: "Questi numeri sono calcolati localmente solo su questo dispositivo, dalla tua attività. Non c'è aggregazione lato server tra utenti.", de: "Diese Zahlen werden lokal nur auf diesem Gerät aus deiner eigenen Aktivität berechnet. Es gibt keine serverseitige Aggregation über Nutzer hinweg." },
  metricsLearningTitle: { en: "Learning", ar: "التعلّم", ary: "Tta3lim", fr: "Apprentissage", es: "Aprendizaje", pt: "Aprendizado", it: "Apprendimento", de: "Lernen" },
  metricsEngagementTitle: { en: "Engagement", ar: "التفاعل", ary: "Ttafa3ol", fr: "Engagement", es: "Interacción", pt: "Engajamento", it: "Coinvolgimento", de: "Interaktion" },
  metricsOutcomeTitle: { en: "Outcomes", ar: "النتائج", ary: "Nnataij", fr: "Résultats", es: "Resultados", pt: "Resultados", it: "Risultati", de: "Ergebnisse" },
  metricsLessonsCompleted: { en: "Lessons completed", ar: "دروس مكتملة", ary: "Dorous kmelin", fr: "Leçons terminées", es: "Lecciones completadas", pt: "Lições concluídas", it: "Lezioni completate", de: "Abgeschlossene Lektionen" },
  metricsCompletionRate: { en: "Completion rate", ar: "معدّل الإتمام", ary: "M3adel ttakmil", fr: "Taux d'achèvement", es: "Tasa de finalización", pt: "Taxa de conclusão", it: "Tasso di completamento", de: "Abschlussquote" },
  metricsExercisesCorrect: { en: "Correct exercises", ar: "تمارين صحيحة", ary: "Tmarin s7a7", fr: "Exercices corrects", es: "Ejercicios correctos", pt: "Exercícios corretos", it: "Esercizi corretti", de: "Richtige Übungen" },
  metricsDueReviews: { en: "Reviews due", ar: "مراجعات مستحقة", ary: "Mraja3at mstahqqa", fr: "Révisions dues", es: "Repasos pendientes", pt: "Revisões pendentes", it: "Ripassi dovuti", de: "Fällige Wiederholungen" },
  metricsProjectsCompleted: { en: "Projects completed", ar: "مشاريع مكتملة", ary: "Machari3 kmelin", fr: "Projets terminés", es: "Proyectos completados", pt: "Projetos concluídos", it: "Progetti completati", de: "Abgeschlossene Projekte" },
  metricsChallengesCompleted: { en: "Challenges completed", ar: "تحديات مكتملة", ary: "T7adiyat kmelin", fr: "Défis terminés", es: "Retos completados", pt: "Desafios concluídos", it: "Sfide completate", de: "Abgeschlossene Herausforderungen" },
  metricsActiveDays7: { en: "Active days (7d)", ar: "أيام نشطة (7 أيام)", ary: "Ayam nachita (7 dyam)", fr: "Jours actifs (7j)", es: "Días activos (7d)", pt: "Dias ativos (7d)", it: "Giorni attivi (7g)", de: "Aktive Tage (7T)" },
  metricsActiveDays30: { en: "Active days (30d)", ar: "أيام نشطة (30 يومًا)", ary: "Ayam nachita (30 nhar)", fr: "Jours actifs (30j)", es: "Días activos (30d)", pt: "Dias ativos (30d)", it: "Giorni attivi (30g)", de: "Aktive Tage (30T)" },
  metricsStreak: { en: "Current streak", ar: "السلسلة الحالية", ary: "Silsila l7aliya", fr: "Série actuelle", es: "Racha actual", pt: "Sequência atual", it: "Serie attuale", de: "Aktuelle Serie" },
  metricsStreakHealthy: { en: "Active today or yesterday", ar: "نشط اليوم أو أمس", ary: "Nachit lyoum wla lbare7", fr: "Actif aujourd'hui ou hier", es: "Activo hoy o ayer", pt: "Ativo hoje ou ontem", it: "Attivo oggi o ieri", de: "Heute oder gestern aktiv" },
  metricsStreakAtRisk: { en: "At risk — no activity yesterday or today", ar: "معرّضة للانقطاع — لا نشاط أمس أو اليوم", ary: "F khatar — makaynch nachat lbare7 wla lyoum", fr: "À risque — aucune activité hier ou aujourd'hui", es: "En riesgo — sin actividad ayer o hoy", pt: "Em risco — sem atividade ontem ou hoje", it: "A rischio — nessuna attività ieri o oggi", de: "Gefährdet — keine Aktivität gestern oder heute" },
  metricsSkillsMastered: { en: "Skills mastered", ar: "مهارات مُتقَنة", ary: "Maharat mtqnin", fr: "Compétences maîtrisées", es: "Habilidades dominadas", pt: "Habilidades dominadas", it: "Competenze padroneggiate", de: "Gemeisterte Fähigkeiten" },
  metricsOf: { en: "of", ar: "من", ary: "mn", fr: "sur", es: "de", pt: "de", it: "su", de: "von" },
  metricsStarted: { en: "started", ar: "بدأت", ary: "bdatihom", fr: "démarrées", es: "iniciadas", pt: "iniciadas", it: "iniziate", de: "begonnen" },
  metricsPathsCompleted: { en: "Paths completed", ar: "مسارات مكتملة", ary: "Massarat kmelin", fr: "Parcours terminés", es: "Rutas completadas", pt: "Trilhas concluídas", it: "Percorsi completati", de: "Abgeschlossene Pfade" },
  metricsBooksFinished: { en: "Tracks finished", ar: "مسارات منتهية", ary: "Massarat sali", fr: "Parcours terminés", es: "Cursos terminados", pt: "Cursos terminados", it: "Corsi terminati", de: "Beendete Kurse" },
  metricsAchievements: { en: "Achievements unlocked", ar: "إنجازات مفتوحة", ary: "Njazat mfto7in", fr: "Succès débloqués", es: "Logros desbloqueados", pt: "Conquistas desbloqueadas", it: "Obiettivi sbloccati", de: "Freigeschaltete Erfolge" },
  metricsDashboardBtnLabel: { en: "Product metrics", ar: "مقاييس المنتج", ary: "Mqayis lproduit", fr: "Métriques produit", es: "Métricas del producto", pt: "Métricas do produto", it: "Metriche del prodotto", de: "Produktkennzahlen" },

  // ===== §29: nuevos eventos de micro-interacción (skill_mastered / path_completed) =====
  skillMasteredToast: { en: "Skill mastered: {title}!", ar: "تم إتقان المهارة: {title}!", ary: "Ttqnat lmahara: {title}!", fr: "Compétence maîtrisée : {title} !", es: "¡Habilidad dominada: {title}!", pt: "Habilidade dominada: {title}!", it: "Competenza padroneggiata: {title}!", de: "Fähigkeit gemeistert: {title}!" },
  pathCompletedToast: { en: "Learning path completed: {title}!", ar: "تم إكمال المسار المهني: {title}!", ary: "Kmel massar: {title}!", fr: "Parcours terminé : {title} !", es: "¡Ruta de aprendizaje completada: {title}!", pt: "Trilha de aprendizagem concluída: {title}!", it: "Percorso di apprendimento completato: {title}!", de: "Lernpfad abgeschlossen: {title}!" },

  // ===== Paso de reflexión explícito (lesson experience) =====
  reflectionLabel: { en: "Reflect", ar: "تأمّل", ary: "Ta2mal", fr: "Réflexion", es: "Reflexiona", pt: "Reflita", it: "Rifletti", de: "Reflektiere" },
  reflectionQuestion: { en: "Where might you actually use this in something you're building?", ar: "أين يمكن أن تستخدم هذا فعليًا في شيء تبنيه؟", ary: "Fin ymkn tsta3mel hadi b sa7 f chi 7aja katbni?", fr: "Où pourriez-vous réellement utiliser cela dans quelque chose que vous construisez ?", es: "¿Dónde podrías usar esto realmente en algo que estés construyendo?", pt: "Onde você poderia realmente usar isso em algo que está construindo?", it: "Dove potresti usare davvero questo in qualcosa che stai costruendo?", de: "Wo könntest du das tatsächlich bei etwas anwenden, das du gerade baust?" },

  // ===================================================================
  // §5/§13/§15/§22 patch translations — these keys were referenced by
  // app.js (lesson prerequisite hints, certificate evidence line, the
  // mentor's progressive-reveal stages, and the "matching learning
  // paths" search heading) but were never actually merged into
  // UI_STRINGS. Without them, t() fell back to returning the raw key
  // string to the user (e.g. a button literally showing
  // "mentorShowExplanation" instead of real text). Integrated here.
  // ===================================================================
  lessonPrereqHint: {
    en: "Suggested after: {title}", ar: "يُنصح به بعد: {title}", ary: "Mnasse7 bih mn ba3d: {title}",
    fr: "Conseillé après : {title}", es: "Sugerido después de: {title}", pt: "Sugerido após: {title}",
    it: "Consigliato dopo: {title}", de: "Empfohlen nach: {title}"
  },
  certificateEvidenceLine: {
    en: "{lessons}/{total} lessons · {practice} practices · {challenges} challenges · {projects} projects · {mastery}% mastery",
    ar: "{lessons}/{total} دروس · {practice} تطبيقات · {challenges} تحديات · {projects} مشاريع · إتقان {mastery}%",
    ary: "{lessons}/{total} dorous · {practice} ttatbi9at · {challenges} t7adiyat · {projects} machari3 · itqan {mastery}%",
    fr: "{lessons}/{total} leçons · {practice} pratiques · {challenges} défis · {projects} projets · maîtrise {mastery}%",
    es: "{lessons}/{total} lecciones · {practice} prácticas · {challenges} retos · {projects} proyectos · dominio {mastery}%",
    pt: "{lessons}/{total} lições · {practice} práticas · {challenges} desafios · {projects} projetos · domínio {mastery}%",
    it: "{lessons}/{total} lezioni · {practice} pratiche · {challenges} sfide · {projects} progetti · padronanza {mastery}%",
    de: "{lessons}/{total} Lektionen · {practice} Übungen · {challenges} Herausforderungen · {projects} Projekte · {mastery}% Beherrschung"
  },
  mentorShowExplanation: {
    en: "Show explanation", ar: "أظهر الشرح", ary: "Wri chra7",
    fr: "Afficher l'explication", es: "Mostrar explicación", pt: "Mostrar explicação",
    it: "Mostra spiegazione", de: "Erklärung anzeigen"
  },
  mentorShowGuidedStep: {
    en: "Show the next step", ar: "أظهر الخطوة التالية", ary: "Wri lkhotwa li mn ba3d",
    fr: "Afficher l'étape suivante", es: "Mostrar el siguiente paso", pt: "Mostrar o próximo passo",
    it: "Mostra il prossimo passo", de: "Nächsten Schritt anzeigen"
  },
  mentorGuidedStepLabel: {
    en: "Guided step", ar: "خطوة موجَّهة", ary: "Khotwa mwajjaha",
    fr: "Étape guidée", es: "Paso guiado", pt: "Passo guiado",
    it: "Passo guidato", de: "Angeleiteter Schritt"
  },
  mentorGuidedReview: {
    en: "Open the lesson, reread the tip, then answer the reflection question in your own words before moving on.",
    ar: "افتح الدرس، أعد قراءة التلميح، ثم أجب عن سؤال التأمل بكلماتك الخاصة قبل الانتقال.",
    ary: "7ell dars, 3awed 9ra talmi7, mn ba3d jaweb 3la so2al ta2mal b klimatek 9bel matkemmel.",
    fr: "Ouvrez la leçon, relisez le conseil, puis répondez à la question de réflexion avec vos propres mots avant de continuer.",
    es: "Abre la lección, vuelve a leer el consejo, y responde la pregunta de reflexión con tus propias palabras antes de continuar.",
    pt: "Abra a lição, releia a dica, e responda à pergunta de reflexão com suas próprias palavras antes de continuar.",
    it: "Apri la lezione, rileggi il consiglio, poi rispondi alla domanda di riflessione con parole tue prima di continuare.",
    de: "Öffne die Lektion, lies den Hinweis erneut und beantworte die Reflexionsfrage mit eigenen Worten, bevor du weitermachst."
  },
  mentorGuidedWeakness: {
    en: "Open \"{title}\", write at least two full sentences in the practice box explaining the idea, then check the skill map again.",
    ar: "افتح \"{title}\"، اكتب جملتين كاملتين على الأقل فـ صندوق التطبيق تشرح فيهما الفكرة، ثم راجع خريطة المهارة مجددًا.",
    ary: "7ell \"{title}\", kteb jouj jomal kamlin 3la la9al fi practice box tchre7 fihom lfikra, mn ba3d chouf skill map mn jdid.",
    fr: "Ouvrez « {title} », écrivez au moins deux phrases complètes dans la zone de pratique pour expliquer l'idée, puis revérifiez la carte des compétences.",
    es: "Abre \"{title}\", escribe al menos dos frases completas en el cuadro de práctica explicando la idea, y revisa de nuevo el mapa de habilidades.",
    pt: "Abra \"{title}\", escreva pelo menos duas frases completas na caixa de prática explicando a ideia, e revise o mapa de habilidades novamente.",
    it: "Apri \"{title}\", scrivi almeno due frasi complete nel riquadro pratica spiegando l'idea, poi ricontrolla la mappa delle competenze.",
    de: "Öffne \"{title}\", schreibe mindestens zwei vollständige Sätze im Übungsfeld, die die Idee erklären, und prüfe dann die Fähigkeitenkarte erneut."
  },
  mentorGuidedContinue: {
    en: "Open \"{title}\" and complete just the next lesson — one more page keeps the momentum going.",
    ar: "افتح \"{title}\" وأكمل الدرس التالي فقط — صفحة واحدة أخرى تحافظ على الزخم.",
    ary: "7ell \"{title}\" w kmmel ghi dars li mn ba3d — saf7a wa7da khra kathfed momentum.",
    fr: "Ouvrez « {title} » et terminez juste la prochaine leçon — une page de plus maintient l'élan.",
    es: "Abre \"{title}\" y completa solo la siguiente lección — una página más mantiene el impulso.",
    pt: "Abra \"{title}\" e complete apenas a próxima lição — mais uma página mantém o ritmo.",
    it: "Apri \"{title}\" e completa solo la prossima lezione — un'altra pagina mantiene lo slancio.",
    de: "Öffne \"{title}\" und schließe nur die nächste Lektion ab — eine weitere Seite hält den Schwung aufrecht."
  },
  mentorGuidedStart: {
    en: "Pick any skill from the shelves, open its first lesson, and complete just that one page today.",
    ar: "اختر أي مهارة من الأرفف، افتح درسها الأول، وأكمل تلك الصفحة فقط اليوم.",
    ary: "Khtar ay mahara mn rrofouf, 7ell dars lawal dyalha, w kmmel ghi had saf7a lyoum.",
    fr: "Choisissez une compétence sur les étagères, ouvrez sa première leçon, et terminez juste cette page aujourd'hui.",
    es: "Elige cualquier habilidad de las estanterías, abre su primera lección, y completa solo esa página hoy.",
    pt: "Escolha qualquer habilidade nas estantes, abra a primeira lição, e complete apenas essa página hoje.",
    it: "Scegli una competenza dagli scaffali, apri la sua prima lezione, e completa solo quella pagina oggi.",
    de: "Wähle eine Fähigkeit aus den Regalen, öffne ihre erste Lektion und schließe heute nur diese eine Seite ab."
  },
  searchPathsHeading: {
    en: "Matching learning paths", ar: "مسارات مهنية مطابقة", ary: "Massarat mihaniyin mtabqin",
    fr: "Parcours correspondants", es: "Rutas de aprendizaje coincidentes", pt: "Trilhas de aprendizagem correspondentes",
    it: "Percorsi di apprendimento corrispondenti", de: "Passende Lernpfade"
  },

  // ===================================================================
  // Extended practice engine (exercises.js) — code exercise, debugging
  // exercise, and short-answer exercise labels. These were missing
  // entirely: the debugging/code/short-answer exercise types would
  // have rendered raw key names instead of real UI text.
  // ===================================================================
  exerciseCodeLabel: { en: "Coding exercise", ar: "تمرين برمجي", ary: "Tmrin dyal code", fr: "Exercice de code", es: "Ejercicio de código", pt: "Exercício de código", it: "Esercizio di codice", de: "Programmierübung" },
  exerciseDebuggingLabel: { en: "Find and fix the bug", ar: "اعثر على الخطأ وأصلحه", ary: "L9a lbug w sle7o", fr: "Trouvez et corrigez le bug", es: "Encuentra y corrige el error", pt: "Encontre e corrija o erro", it: "Trova e correggi il bug", de: "Finde und behebe den Fehler" },
  exerciseDebuggingPlaceholder: { en: "What's wrong with this code? Describe the bug...", ar: "ما الخطأ في هذا الكود؟ صف الخطأ...", ary: "Ach fih had code? Wsef lbug...", fr: "Qu'est-ce qui ne va pas avec ce code ? Décrivez le bug...", es: "¿Qué está mal en este código? Describe el error...", pt: "O que há de errado com este código? Descreva o erro...", it: "Cosa c'è che non va in questo codice? Descrivi il bug...", de: "Was stimmt an diesem Code nicht? Beschreibe den Fehler..." },
  exerciseIGotItRight: { en: "I got it right", ar: "أجبت بشكل صحيح", ary: "Jawbt s7i7", fr: "J'ai eu juste", es: "Lo hice bien", pt: "Acertei", it: "Ho fatto giusto", de: "Ich hatte es richtig" },
  exerciseModelAnswerLabel: { en: "Model answer", ar: "إجابة نموذجية", ary: "Jawab namoudaji", fr: "Réponse modèle", es: "Respuesta modelo", pt: "Resposta modelo", it: "Risposta modello", de: "Musterantwort" },
  exerciseNeedMorePractice: { en: "I need more practice", ar: "أحتاج إلى مزيد من التطبيق", ary: "Khassni ntmren ktar", fr: "J'ai besoin de plus de pratique", es: "Necesito más práctica", pt: "Preciso de mais prática", it: "Ho bisogno di più pratica", de: "Ich brauche mehr Übung" },
  exerciseRunCode: { en: "Run code", ar: "شغّل الكود", ary: "Khddem code", fr: "Exécuter le code", es: "Ejecutar código", pt: "Executar código", it: "Esegui il codice", de: "Code ausführen" },
  exerciseShortAnswerLabel: { en: "Short answer", ar: "إجابة قصيرة", ary: "Jawab qsir", fr: "Réponse courte", es: "Respuesta corta", pt: "Resposta curta", it: "Risposta breve", de: "Kurzantwort" },
  exerciseShortAnswerPlaceholder: { en: "Write your answer here...", ar: "اكتب إجابتك هنا...", ary: "Kteb jawabek hna...", fr: "Écrivez votre réponse ici...", es: "Escribe tu respuesta aquí...", pt: "Escreva sua resposta aqui...", it: "Scrivi qui la tua risposta...", de: "Schreibe hier deine Antwort..." },
  exerciseShowFix: { en: "Show the fix", ar: "أظهر الإصلاح", ary: "Wri sla7", fr: "Afficher la correction", es: "Mostrar la corrección", pt: "Mostrar a correção", it: "Mostra la correzione", de: "Korrektur anzeigen" },
  exerciseShowModelAnswer: { en: "Show model answer", ar: "أظهر إجابة نموذجية", ary: "Wri jawab namoudaji", fr: "Afficher la réponse modèle", es: "Mostrar respuesta modelo", pt: "Mostrar resposta modelo", it: "Mostra risposta modello", de: "Musterantwort anzeigen" },
  exerciseShowSolution: { en: "Show solution", ar: "أظهر الحل", ary: "Wri l7al", fr: "Afficher la solution", es: "Mostrar solución", pt: "Mostrar solução", it: "Mostra soluzione", de: "Lösung anzeigen" },
  exerciseTestPassed: { en: "Test {index}: passed ✓", ar: "الاختبار {index}: نجح ✓", ary: "Test {index}: nja7 ✓", fr: "Test {index} : réussi ✓", es: "Prueba {index}: superada ✓", pt: "Teste {index}: aprovado ✓", it: "Test {index}: superato ✓", de: "Test {index}: bestanden ✓" },
  exerciseTestFailed: { en: "Test {index}: expected {expected}, got {actual}", ar: "الاختبار {index}: المتوقع {expected}، الناتج {actual}", ary: "Test {index}: mtwe9a3 {expected}, jat {actual}", fr: "Test {index} : attendu {expected}, obtenu {actual}", es: "Prueba {index}: se esperaba {expected}, se obtuvo {actual}", pt: "Teste {index}: esperado {expected}, obtido {actual}", it: "Test {index}: atteso {expected}, ottenuto {actual}", de: "Test {index}: erwartet {expected}, erhalten {actual}" },
  exerciseTestErrored: { en: "Test {index}: error — {error}", ar: "الاختبار {index}: خطأ — {error}", ary: "Test {index}: khata2 — {error}", fr: "Test {index} : erreur — {error}", es: "Prueba {index}: error — {error}", pt: "Teste {index}: erro — {error}", it: "Test {index}: errore — {error}", de: "Test {index}: Fehler — {error}" },

  // ===================================================================
  // §43 community discussion (community.js) — comment thread on shared
  // projects. Missing entirely; the "show comments" button and its
  // whole flow would have shown raw keys instead of real text.
  // ===================================================================
  communityShowComments: { en: "Show comments", ar: "أظهر التعليقات", ary: "Wri comments", fr: "Afficher les commentaires", es: "Mostrar comentarios", pt: "Mostrar comentários", it: "Mostra commenti", de: "Kommentare anzeigen" },
  communityHideComments: { en: "Hide comments", ar: "إخفاء التعليقات", ary: "Khbi comments", fr: "Masquer les commentaires", es: "Ocultar comentarios", pt: "Ocultar comentários", it: "Nascondi commenti", de: "Kommentare ausblenden" },
  communityCommentsLoading: { en: "Loading comments...", ar: "جاري تحميل التعليقات...", ary: "Kayt7ell comments...", fr: "Chargement des commentaires...", es: "Cargando comentarios...", pt: "Carregando comentários...", it: "Caricamento commenti...", de: "Kommentare werden geladen..." },
  communityCommentsEmpty: { en: "No comments yet.", ar: "لا توجد تعليقات بعد.", ary: "Mazal makaynch comments.", fr: "Pas encore de commentaires.", es: "Aún no hay comentarios.", pt: "Ainda não há comentários.", it: "Nessun commento ancora.", de: "Noch keine Kommentare." },
  communityCommentsDisclaimer: { en: "Comments are not moderated automatically. Be kind.", ar: "التعليقات غير مُراقَبة آليًا. كن لطيفًا.", ary: "Comments machi mraqbin automatiquement. Kon mli7.", fr: "Les commentaires ne sont pas modérés automatiquement. Soyez bienveillant.", es: "Los comentarios no se moderan automáticamente. Sé amable.", pt: "Os comentários não são moderados automaticamente. Seja gentil.", it: "I commenti non sono moderati automaticamente. Sii gentile.", de: "Kommentare werden nicht automatisch moderiert. Sei freundlich." },
  communityCommentPlaceholder: { en: "Write a comment...", ar: "اكتب تعليقًا...", ary: "Kteb comment...", fr: "Écrivez un commentaire...", es: "Escribe un comentario...", pt: "Escreva um comentário...", it: "Scrivi un commento...", de: "Schreibe einen Kommentar..." },
  communityCommentSubmit: { en: "Post comment", ar: "نشر التعليق", ary: "Sift comment", fr: "Publier le commentaire", es: "Publicar comentario", pt: "Publicar comentário", it: "Pubblica commento", de: "Kommentar posten" },
  communityCommentSignInRequired: { en: "Sign in to leave a comment.", ar: "سجّل الدخول لترك تعليق.", ary: "Sajel ddkhol bach tkteb comment.", fr: "Connectez-vous pour laisser un commentaire.", es: "Inicia sesión para dejar un comentario.", pt: "Faça login para deixar um comentário.", it: "Accedi per lasciare un commento.", de: "Melde dich an, um einen Kommentar zu hinterlassen." },
  communityCommentError: { en: "Could not post your comment. Try again later.", ar: "تعذّر نشر تعليقك. حاول لاحقًا.", ary: "Ma 9dernach nsiftou comment dyalek. 3awed jarreb mn ba3d.", fr: "Impossible de publier votre commentaire. Réessayez plus tard.", es: "No se pudo publicar tu comentario. Inténtalo más tarde.", pt: "Não foi possível publicar seu comentário. Tente novamente mais tarde.", it: "Impossibile pubblicare il tuo commento. Riprova più tardi.", de: "Dein Kommentar konnte nicht gepostet werden. Versuche es später erneut." }
};
