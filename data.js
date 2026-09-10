// بيانات المنصة: فئات → أرفف → كتب (مسارات) → صفحات (دروس)
const SKILL_DATA = [
  {
    id: "programming",
    name: { en: "Programming", ar: "البرمجة", ary: "Programmation", fr: "Programmation", es: "Programacion", pt: "Programacao", it: "Programmazione", de: "Programmierung" },
    spineColor: "#2F6F5E",
    tracks: [
      {
        id: "js-basics",
        title: {
          en: "JavaScript Fundamentals", ar: "أساسيات جافاسكريبت", ary: "Lbasics dyal JavaScript",
          fr: "Les fondamentaux de JavaScript", es: "Fundamentos de JavaScript",
          pt: "Fundamentos de JavaScript", it: "Fondamenti di JavaScript", de: "JavaScript-Grundlagen"
        },
        author: {
          en: "Masar Programming", ar: "مسار البرمجة", ary: "Masar dyal programmation",
          fr: "Masar Programmation", es: "Masar Programación", pt: "Masar Programação",
          it: "Masar Programmazione", de: "Masar Programmierung"
        },
        summary: {
          en: "Variables, functions, and flow control from the ground up.", ar: "المتغيرات، الدوال، والتحكم في تدفق الكود من الصفر.",
          ary: "Lmotaghayyirat, lfonctions, w kifach kaymchi l-code mn zero.",
          fr: "Variables, fonctions et contrôle du flux du code depuis les bases.",
          es: "Variables, funciones y control del flujo del código desde cero.",
          pt: "Variáveis, funções e controle do fluxo do código desde o início.",
          it: "Variabili, funzioni e controllo del flusso del codice dalle basi.",
          de: "Variablen, Funktionen und Ablaufsteuerung von Grund auf."
        },
        duration: { en: "~45 minutes", ar: "~45 دقيقة", ary: "~45 d9i9a", fr: "~45 minutes", es: "~45 minutos", pt: "~45 minutos", it: "~45 minuti", de: "~45 Minuten" },
        level: "beginner",
        lessons: [
          { title: { en: "Variables and data types", ar: "المتغيرات وأنواع البيانات", ary: "Lmotaghayyirat w naw3 dyal data", fr: "Variables et types de données", es: "Variables y tipos de datos", pt: "Variáveis e tipos de dados", it: "Variabili e tipi di dati", de: "Variablen und Datentypen" }, tip: { en: "Store your name and age in two variables, then print them together in one sentence.", ar: "جرّب تخزين اسمك وعمرك في متغيرين، واطبعهما معًا في جملة واحدة.", ary: "Jreb tkhzen smitek w 3omrek f juj variables, w printihom f jomla wa7da.", fr: "Stockez votre nom et votre âge dans deux variables, puis affichez-les dans une phrase.", es: "Guarda tu nombre y edad en dos variables e imprímelos juntos en una frase.", pt: "Guarde seu nome e idade em duas variáveis e imprima-os juntos em uma frase.", it: "Salva nome ed età in due variabili e stampali insieme in una frase.", de: "Speichere deinen Namen und dein Alter in zwei Variablen und gib sie in einem Satz aus." } },
          { title: { en: "Conditions (if / else)", ar: "الشروط (if / else)", ary: "Chorout (if / else)", fr: "Conditions (if / else)", es: "Condiciones (if / else)", pt: "Condições (if / else)", it: "Condizioni (if / else)", de: "Bedingungen (if / else)" }, tip: { en: "Write a condition that prints “Good morning” or “Good evening” based on the current hour.", ar: "اكتب شرطًا يطبع \"صباح الخير\" أو \"مساء الخير\" حسب الساعة الحالية.", ary: "Kteb condition katprinti \"sbah lkhir\" wla \"msa lkhir\" 3la 7sab sa3a.", fr: "Écrivez une condition qui affiche « Bonjour » ou « Bonsoir » selon l’heure.", es: "Escribe una condición que muestre «Buenos días» o «Buenas tardes» según la hora.", pt: "Escreva uma condição que mostre “Bom dia” ou “Boa noite” conforme a hora.", it: "Scrivi una condizione che mostri “Buongiorno” o “Buonasera” in base all’ora.", de: "Schreibe eine Bedingung, die je nach Uhrzeit „Guten Morgen“ oder „Guten Abend“ ausgibt." } },
          { title: { en: "Loops", ar: "الحلقات التكرارية", ary: "L7l9at tkrar", fr: "Boucles", es: "Bucles", pt: "Laços", it: "Cicli", de: "Schleifen" }, tip: { en: "Print the multiplication table for a number of your choice using a for loop.", ar: "اطبع جدول الضرب لرقم من اختيارك باستخدام حلقة for.", ary: "Printi jdul drb dyal ra9m khtarti b for.", fr: "Affichez la table de multiplication d’un nombre de votre choix avec une boucle for.", es: "Imprime la tabla de multiplicar de un número usando un bucle for.", pt: "Imprima a tabuada de um número à sua escolha usando um laço for.", it: "Stampa la tabellina di un numero a scelta usando un ciclo for.", de: "Gib mit einer for-Schleife das Einmaleins einer Zahl deiner Wahl aus." } },
          { title: { en: "Functions and parameters", ar: "الدوال ومعامِلاتها", ary: "Fonctions w parameters dyalhom", fr: "Fonctions et paramètres", es: "Funciones y parámetros", pt: "Funções e parâmetros", it: "Funzioni e parametri", de: "Funktionen und Parameter" }, tip: { en: "Write a function that converts a temperature from Celsius to Fahrenheit.", ar: "اكتب دالة تحوّل درجة الحرارة من مئوية إلى فهرنهايت.", ary: "Kteb fonction kat7awwel daraja mn Celsius l Fahrenheit.", fr: "Écrivez une fonction qui convertit une température de Celsius en Fahrenheit.", es: "Escribe una función que convierta una temperatura de Celsius a Fahrenheit.", pt: "Escreva uma função que converta uma temperatura de Celsius para Fahrenheit.", it: "Scrivi una funzione che converta una temperatura da Celsius a Fahrenheit.", de: "Schreibe eine Funktion, die eine Temperatur von Celsius in Fahrenheit umrechnet." } },
          { title: { en: "Arrays and working with them", ar: "المصفوفات والتعامل معها", ary: "Arrays w kifach nkhdmo bihom", fr: "Tableaux et manipulation", es: "Arrays y cómo trabajar con ellos", pt: "Arrays e como trabalhar com eles", it: "Array e gestione", de: "Arrays und ihre Verwendung" }, tip: { en: "Create an array of your friends’ names and sort it alphabetically.", ar: "أنشئ مصفوفة بأسماء أصدقائك ورتّبها أبجديًا.", ary: "Sawb array fiha smiyat s7abek w rtbhom alfabetiquement.", fr: "Créez un tableau de prénoms de vos amis et triez-le par ordre alphabétique.", es: "Crea un array con los nombres de tus amigos y ordénalo alfabéticamente.", pt: "Crie um array com os nomes dos seus amigos e ordene-o alfabeticamente.", it: "Crea un array con i nomi dei tuoi amici e ordinalo alfabeticamente.", de: "Erstelle ein Array mit den Namen deiner Freunde und sortiere es alphabetisch." } },
          { title: { en: "Objects", ar: "الكائنات (Objects)", ary: "Objects", fr: "Objets", es: "Objetos", pt: "Objetos", it: "Oggetti", de: "Objekte" }, tip: { en: "Represent a book as an object containing its title, author, and page count.", ar: "مثّل كتابًا كائنًا يحوي العنوان والمؤلف وعدد الصفحات.", ary: "Mettel kteb b object fih smiya, l-mouallif, w ch7al mn saf7a.", fr: "Représentez un livre comme un objet contenant son titre, son auteur et son nombre de pages.", es: "Representa un libro como un objeto con título, autor y número de páginas.", pt: "Represente um livro como um objeto com título, autor e número de páginas.", it: "Rappresenta un libro come un oggetto con titolo, autore e numero di pagine.", de: "Stelle ein Buch als Objekt mit Titel, Autor und Seitenzahl dar." } }
        ]
      },
      {
        id: "python-beginners",
        title: {
          en: "Python for Beginners", ar: "بايثون للمبتدئين", ary: "Python l-mobtadi2in",
          fr: "Python pour débutants", es: "Python para principiantes", pt: "Python para iniciantes",
          it: "Python per principianti", de: "Python für Anfänger"
        },
        author: {
          en: "Masar Programming", ar: "مسار البرمجة", ary: "Masar dyal programmation",
          fr: "Masar Programmation", es: "Masar Programación", pt: "Masar Programação",
          it: "Masar Programmazione", de: "Masar Programmierung"
        },
        summary: {
          en: "An easy-to-read language, perfect for your first step into programming.", ar: "لغة سهلة القراءة، مثالية لأول خطوة في البرمجة.",
          ary: "Logha sahla f l9raya, zwina bach tbda biha programmation.",
          fr: "Un langage facile à lire, idéal pour faire ses premiers pas en programmation.",
          es: "Un lenguaje fácil de leer, perfecto para dar tus primeros pasos en programación.",
          pt: "Uma linguagem fácil de ler, ideal para seu primeiro passo na programação.",
          it: "Un linguaggio facile da leggere, perfetto per iniziare a programmare.",
          de: "Eine leicht lesbare Sprache, ideal für den Einstieg in die Programmierung."
        },
        duration: { en: "~40 minutes", ar: "~40 دقيقة", ary: "~40 d9i9a", fr: "~40 minutes", es: "~40 minutos", pt: "~40 minutos", it: "~40 minuti", de: "~40 Minuten" },
        level: "beginner",
        lessons: [
          { title: { en: "Printing your first line of code", ar: "طباعة أول سطر كود", ary: "Tbe3 awal star dyal code", fr: "Afficher sa première ligne de code", es: "Imprimir tu primera línea de código", pt: "Imprimir sua primeira linha de código", it: "Stampare la prima riga di codice", de: "Die erste Codezeile ausgeben" }, tip: { en: "Print your full name, then your city on two separate lines.", ar: "اطبع اسمك الكامل ثم مدينتك في سطرين منفصلين.", ary: "Printi smitek kamel w mn ba3d mdintek f juj stor mfro9in.", fr: "Affichez votre nom complet, puis votre ville sur deux lignes séparées.", es: "Imprime tu nombre completo y luego tu ciudad en dos líneas separadas.", pt: "Imprima seu nome completo e depois sua cidade em duas linhas separadas.", it: "Stampa il tuo nome completo e poi la tua città su due righe separate.", de: "Gib deinen vollständigen Namen und dann deine Stadt in zwei getrennten Zeilen aus." } },
          { title: { en: "User input", ar: "المدخلات من المستخدم", ary: "Lmadkhalat dyal l-mosta3mil", fr: "Les entrées utilisateur", es: "Entrada del usuario", pt: "Entrada do usuário", it: "Input dell’utente", de: "Benutzereingaben" }, tip: { en: "Write a program that asks for your name and welcomes you.", ar: "اكتب برنامجًا يسأل عن اسمك ويرحب بك به.", ary: "Kteb programme kaysewel 3la smitek w kayr7eb bik.", fr: "Écrivez un programme qui demande votre nom et vous souhaite la bienvenue.", es: "Escribe un programa que pregunte tu nombre y te dé la bienvenida.", pt: "Escreva um programa que peça seu nome e dê boas-vindas.", it: "Scrivi un programma che chieda il tuo nome e ti dia il benvenuto.", de: "Schreibe ein Programm, das nach deinem Namen fragt und dich begrüßt." } },
          { title: { en: "Lists", ar: "القوائم (Lists)", ary: "L9wayem (Lists)", fr: "Listes", es: "Listas", pt: "Listas", it: "Liste", de: "Listen" }, tip: { en: "Create a list of your favorite foods and print its second item.", ar: "أنشئ قائمة بأطعمتك المفضلة واطبع العنصر الثاني منها.", ary: "Sawb liste dyal lmakla li kat3jbk w printi l3onsor tani.", fr: "Créez une liste de vos aliments préférés et affichez son deuxième élément.", es: "Crea una lista de tus comidas favoritas e imprime el segundo elemento.", pt: "Crie uma lista dos seus alimentos favoritos e imprima o segundo item.", it: "Crea una lista dei tuoi cibi preferiti e stampa il secondo elemento.", de: "Erstelle eine Liste deiner Lieblingsspeisen und gib das zweite Element aus." } },
          { title: { en: "Dictionaries", ar: "القواميس (Dictionaries)", ary: "Qawamis (Dictionaries)", fr: "Dictionnaires", es: "Diccionarios", pt: "Dicionários", it: "Dizionari", de: "Dictionaries" }, tip: { en: "Store a friend’s details (name, age, city) in one dictionary.", ar: "خزّن بيانات صديق (الاسم، العمر، المدينة) في قاموس واحد.", ary: "Khzen ma3loumat dyal chi s7ab (smiya, l3omr, lmdina) f dictionary wa7ed.", fr: "Stockez les informations d’un ami (nom, âge, ville) dans un dictionnaire.", es: "Guarda los datos de un amigo (nombre, edad y ciudad) en un diccionario.", pt: "Guarde os dados de um amigo (nome, idade e cidade) em um dicionário.", it: "Salva i dati di un amico (nome, età, città) in un dizionario.", de: "Speichere die Daten eines Freundes (Name, Alter, Stadt) in einem Dictionary." } },
          { title: { en: "Functions in Python", ar: "الدوال في بايثون", ary: "Fonctions f Python", fr: "Fonctions en Python", es: "Funciones en Python", pt: "Funções em Python", it: "Funzioni in Python", de: "Funktionen in Python" }, tip: { en: "Write a function that calculates a rectangle’s area from its length and width.", ar: "اكتب دالة تحسب مساحة مستطيل بمعطى الطول والعرض.", ary: "Kteb fonction kat7seb l-masaha dyal mostatil b toul w l3ard.", fr: "Écrivez une fonction qui calcule l’aire d’un rectangle avec sa longueur et sa largeur.", es: "Escribe una función que calcule el área de un rectángulo con su largo y ancho.", pt: "Escreva uma função que calcule a área de um retângulo com comprimento e largura.", it: "Scrivi una funzione che calcoli l’area di un rettangolo dati base e altezza.", de: "Schreibe eine Funktion, die die Fläche eines Rechtecks aus Länge und Breite berechnet." } },
          { title: { en: "Handling errors", ar: "التعامل مع الأخطاء", ary: "Kifach nt3amlo m3a l-akhta2", fr: "Gestion des erreurs", es: "Manejo de errores", pt: "Tratamento de erros", it: "Gestione degli errori", de: "Fehlerbehandlung" }, tip: { en: "Use try/except to keep the program from stopping when dividing by zero.", ar: "استخدم try/except لمنع البرنامج من التوقف عند قسمة على صفر.", ary: "Sta3mel try/except bach l-programme ma y7bssch ila 9semti 3la zero.", fr: "Utilisez try/except pour empêcher le programme de s’arrêter lors d’une division par zéro.", es: "Usa try/except para evitar que el programa se detenga al dividir entre cero.", pt: "Use try/except para impedir que o programa pare ao dividir por zero.", it: "Usa try/except per evitare che il programma si interrompa dividendo per zero.", de: "Verwende try/except, damit das Programm bei einer Division durch null nicht abbricht." } }
        ]
      }
    ]
  },
  {
    id: "languages",
    name: { en: "Languages", ar: "اللغات", ary: "Loghat", fr: "Langues", es: "Idiomas", pt: "Idiomas", it: "Lingue", de: "Sprachen" },
    spineColor: "#8A5A2B",
    tracks: [
      {
        id: "english-conversation",
        title: "الإنجليزية للمحادثة",
        author: "مسار اللغات",
        summary: "عبارات وجمل عملية تستخدمها يوميًا في الحديث.",
        duration: { en: "~35 minutes", ar: "~35 دقيقة", ary: "~35 d9i9a", fr: "~35 minutes", es: "~35 minutos", pt: "~35 minutos", it: "~35 minuti", de: "~35 Minuten" },
        level: "beginner",
        lessons: [
          { title: "التحيات والتعارف", tip: "تدرّب على تعريف نفسك بثلاث جمل مختلفة باللغة الإنجليزية." },
          { title: "طلب الطعام في مطعم", tip: "احفظ جملتين لطلب وجبة ودفع الفاتورة." },
          { title: "السؤال عن الاتجاهات", tip: "اسأل صديقًا (تخيّليًا) عن أقرب محطة مترو." },
          { title: "التحدث عن الطقس والوقت", tip: "صف حالة الطقس اليوم بثلاث جمل بسيطة." },
          { title: "المحادثة الهاتفية", tip: "تدرّب على بدء وإنهاء مكالمة هاتفية قصيرة." },
          { title: "التعبير عن الرأي", tip: "اذكر رأيك في فيلم شاهدته مؤخرًا بجملتين." }
        ]
      },
      {
        id: "french-basics",
        title: "أساسيات الفرنسية",
        author: "مسار اللغات",
        summary: "الانطلاقة الأولى في لغة موليير: نطق وكلمات شائعة.",
        duration: { en: "~40 minutes", ar: "~40 دقيقة", ary: "~40 d9i9a", fr: "~40 minutes", es: "~40 minutos", pt: "~40 minutos", it: "~40 minuti", de: "~40 Minuten" },
        level: "beginner",
        lessons: [
          { title: "الأبجدية والنطق", tip: "تدرّب على نطق الحروف الفرنسية العشرة الأولى." },
          { title: "التحية والتعريف بالنفس", tip: "احفظ جملة \"Je m'appelle...\" واستخدمها لتقديم نفسك." },
          { title: "الأرقام من 1 إلى 20", tip: "عدّ بصوت عالٍ من 1 إلى 20 بالفرنسية." },
          { title: "أفراد العائلة", tip: "اذكر ثلاثة من أفراد عائلتك بالفرنسية." },
          { title: "الألوان والأشياء", tip: "صف لون ثلاثة أشياء من حولك الآن." },
          { title: "جمل يومية بسيطة", tip: "اكتب ثلاث جمل عن يومك باستخدام مفردات هذا المسار." }
        ]
      }
    ]
  },
  {
    id: "design",
    name: { en: "Design", ar: "التصميم", ary: "Ttsmim", fr: "Design", es: "Diseno", pt: "Design", it: "Design", de: "Design" },
    spineColor: "#B0473E",
    tracks: [
      {
        id: "ui-ux-basics",
        title: "أساسيات UI/UX",
        author: "مسار التصميم",
        summary: "مبادئ تصميم واجهات سهلة الاستخدام وممتعة بصريًا.",
        duration: { en: "~50 minutes", ar: "~50 دقيقة", ary: "~50 d9i9a", fr: "~50 minutes", es: "~50 minutos", pt: "~50 minutos", it: "~50 minuti", de: "~50 Minuten" },
        level: "intermediate",
        lessons: [
          { title: "الفرق بين UI و UX", tip: "اكتب بجملتين الفرق بينهما بأسلوبك الخاص." },
          { title: "التباعد والمحاذاة", tip: "افتح تطبيقًا تستخدمه وحدد ثلاثة أمثلة على محاذاة جيدة." },
          { title: "نظرية الألوان الأساسية", tip: "اختر ثلاثة ألوان متناسقة لتصميم افتراضي." },
          { title: "اختيار الخطوط", tip: "قارن بين خط للعناوين وآخر للنصوص في تصميم واحد." },
          { title: "تصميم الأزرار والحالات", tip: "ارسم زرًا بثلاث حالات: عادي، تحويم، معطّل." },
          { title: "اختبار سهولة الاستخدام", tip: "اطلب من شخص تجربة تطبيق واكتب ملاحظتين على صعوباته." }
        ]
      },
      {
        id: "photography",
        title: "التصوير الفوتوغرافي",
        author: "مسار التصميم",
        summary: "كيف تلتقط صورًا أفضل بأي كاميرا تملكها.",
        duration: { en: "~45 minutes", ar: "~45 دقيقة", ary: "~45 d9i9a", fr: "~45 minutes", es: "~45 minutos", pt: "~45 minutos", it: "~45 minuti", de: "~45 Minuten" },
        level: "beginner",
        lessons: [
          { title: "قاعدة الأثلاث", tip: "التقط صورة تضع فيها موضوعك على أحد خطوط الأثلاث." },
          { title: "الإضاءة الطبيعية", tip: "التقط نفس المشهد في وقتين مختلفين من اليوم وقارن." },
          { title: "زوايا التصوير", tip: "صوّر شيئًا واحدًا من ثلاث زوايا مختلفة." },
          { title: "العمق والخلفية", tip: "التقط صورة يكون فيها الخلفية ضبابية والموضوع واضحًا." },
          { title: "أساسيات التعديل", tip: "عدّل السطوع والتباين لصورة واحدة والاحظ الفرق." },
          { title: "سرد قصة بالصور", tip: "التقط ثلاث صور تحكي بداية ووسط ونهاية لحدث بسيط." }
        ]
      }
    ]
  },
  {
    id: "business",
    name: { en: "Business", ar: "الأعمال", ary: "L-a3mal", fr: "Affaires", es: "Negocios", pt: "Negocios", it: "Affari", de: "Business" },
    spineColor: "#3B5B8C",
    tracks: [
      {
        id: "digital-marketing",
        title: "التسويق الرقمي",
        author: "مسار الأعمال",
        summary: "كيف تصل لجمهورك وتبني علامة تجارية عبر الإنترنت.",
        duration: { en: "~55 minutes", ar: "~55 دقيقة", ary: "~55 d9i9a", fr: "~55 minutes", es: "~55 minutos", pt: "~55 minutos", it: "~55 minuti", de: "~55 Minuten" },
        level: "intermediate",
        lessons: [
          { title: "من هو جمهورك المستهدف؟", tip: "صف عميلك المثالي في ثلاث نقاط." },
          { title: "أساسيات وسائل التواصل", tip: "قارن بين منصتين لمعرفة أيهما تناسب فكرة مشروعك." },
          { title: "كتابة إعلان جذاب", tip: "اكتب عنوان إعلان بثلاث نسخ مختلفة لنفس المنتج." },
          { title: "التسويق بالمحتوى", tip: "اقترح ثلاث أفكار منشورات لمنتج تحبه." },
          { title: "قياس النتائج", tip: "اذكر مؤشرين تستخدمهما لمعرفة نجاح حملة إعلانية." },
          { title: "بناء الولاء للعلامة", tip: "اقترح فكرة واحدة لمكافأة عميل متكرر." }
        ]
      },
      {
        id: "time-management",
        title: "إدارة الوقت",
        author: "مسار الأعمال",
        summary: "عادات وأدوات بسيطة لإنجاز المزيد دون إرهاق.",
        duration: { en: "~30 minutes", ar: "~30 دقيقة", ary: "~30 d9i9a", fr: "~30 minutes", es: "~30 minutos", pt: "~30 minutos", it: "~30 minuti", de: "~30 Minuten" },
        level: "beginner",
        lessons: [
          { title: "تحديد الأولويات", tip: "رتّب مهامك اليوم حسب الأهمية لا الأسهل أولًا." },
          { title: "تقنية بومودورو", tip: "جرّب 25 دقيقة عمل متواصل تليها 5 دقائق راحة." },
          { title: "تقليل المشتتات", tip: "أغلق إشعارات هاتفك لمدة ساعة واحدة وراقب الفرق." },
          { title: "التخطيط الأسبوعي", tip: "اكتب ثلاث أهداف تريد إنجازها هذا الأسبوع." },
          { title: "قول \"لا\" بلباقة", tip: "تدرّب على صياغة رفض لطيف لطلب لا يناسب وقتك." },
          { title: "مراجعة الإنجاز", tip: "في نهاية يومك، اكتب أهم إنجاز حققته." }
        ]
      }
    ]
  },
  {
    id: "life",
    name: { en: "Life skills", ar: "مهارات الحياة", ary: "Mharat l7ayat", fr: "Compétences de vie", es: "Habilidades para la vida", pt: "Habilidades para a vida", it: "Competenze di vita", de: "Lebenskompetenzen" },
    spineColor: "#6B4C8A",
    tracks: [
      {
        id: "cooking-basics",
        title: "الطبخ للمبتدئين",
        author: "مسار الحياة",
        summary: "المهارات الأساسية في المطبخ التي تخدمك طوال العمر.",
        duration: { en: "~45 minutes", ar: "~45 دقيقة", ary: "~45 d9i9a", fr: "~45 minutes", es: "~45 minutos", pt: "~45 minutos", it: "~45 minuti", de: "~45 Minuten" },
        level: "beginner",
        lessons: [
          { title: "تقطيع الخضار بأمان", tip: "تدرّب على تقطيع بصلة بطريقة صحيحة وآمنة." },
          { title: "أساسيات التتبيل", tip: "جرّب تتبيل نفس الطبق بطريقتين مختلفتين وقارن الطعم." },
          { title: "طهي الأرز بشكل مثالي", tip: "اطبخ كوب أرز واضبط كمية الماء للحصول على نتيجة متفتتة." },
          { title: "تحضير صلصة أساسية", tip: "حضّر صلصة طماطم بسيطة من ثلاثة مكونات فقط." },
          { title: "شوي أو قلي البروتين", tip: "اطهُ قطعة دجاج أو خضار بطريقة الشوي ولاحظ درجة النضج." },
          { title: "تنظيم المطبخ أثناء الطهي", tip: "جهّز كل مكوناتك قبل بدء الطهي (mise en place)." }
        ]
      },
      {
        id: "creative-writing",
        title: "الكتابة الإبداعية",
        author: "مسار الحياة",
        summary: "أطلق خيالك واكتب قصصًا تستحق القراءة.",
        duration: { en: "~50 minutes", ar: "~50 دقيقة", ary: "~50 d9i9a", fr: "~50 minutes", es: "~50 minutos", pt: "~50 minutos", it: "~50 minuti", de: "~50 Minuten" },
        level: "intermediate",
        lessons: [
          { title: "فكرة القصة", tip: "اكتب فكرة قصة في جملتين فقط." },
          { title: "بناء الشخصية", tip: "صف شخصية خيالية من ثلاث صفات مميزة." },
          { title: "الحوار الطبيعي", tip: "اكتب حوارًا قصيرًا بين شخصيتين حول قرار صعب." },
          { title: "الوصف الحسي", tip: "صف مكانًا باستخدام حاستين مختلفتين غير البصر." },
          { title: "بداية جذابة", tip: "اكتب أول جملة في قصة تجعل القارئ يريد الاستمرار." },
          { title: "المراجعة والتحرير", tip: "أعد قراءة نص كتبته واحذف كل كلمة غير ضرورية." }
        ]
      }
    ]
  }
];
