// ===================================================================
// محرك التمارين الموسّع (Extended Practice Engine)
// ===================================================================
// يضيف أنواع تمارين إضافية غير اختبار الاختيار المتعدد الموجود أصلاً
// (buildQuizBox فـ app.js): صح/خطأ، إكمال الفراغ، الترتيب، والمطابقة.
//
// شكل البيانات المتوقع على lesson.exercises (اختياري بالكامل — أي درس
// بلا هذا الحقل ببساطة ما يظهرش له أي تمرين هنا):
//
//   exercises: [
//     { id, type: "trueFalse", statement: {lang}, correct: true|false, explanation: {lang} },
//     { id, type: "fillBlank", sentence: {lang} (يحتوي "___"), answer: {lang}, explanation: {lang} },
//     { id, type: "ordering", prompt: {lang}, items: [{id, text:{lang}}], correctOrder: [id,...], explanation: {lang} },
//     { id, type: "matching", prompt: {lang}, pairs: [{id, left:{lang}, right:{lang}}], explanation: {lang} },
//     { id, type: "scenario", context: {lang}, prompt: {lang}, options: [{id, text:{lang}}], correctId, explanation: {lang} }
//   ]
//
// "scenario" (§9 من المواصفة — decision-making exercises): يعرض موقفًا
// واقعيًا قصيرًا (context) ثم سؤال قرار (prompt) بخيارات متعددة، بخلاف
// quiz العادي فـ app.js الذي يختبر معرفة مباشرة بلا سياق قصصي. الهدف
// اختبار "هل تعرف متى تستعمل هذا؟" لا فقط "هل تعرف تعريفه؟".
//
// التخزين محلي بالكامل (localStorage)، بنفس نمط QUIZ_KEY الموجود فـ app.js،
// ولا يمس progressRepository أو أي مخطط بيانات موجود.
// ===================================================================

// EXERCISES_KEY منقول إلى js/core/constants.js (يُحمَّل قبل هذا الملف).
function loadExerciseState() {
  try {
    const raw = JSON.parse(localStorage.getItem(EXERCISES_KEY));
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function saveExerciseResult(lessonId, exerciseId, result) {
  const state = loadExerciseState();
  if (!state[lessonId]) state[lessonId] = {};
  state[lessonId][exerciseId] = { ...result, updatedAt: Date.now() };
  try {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(state));
  } catch (e) {
    // فشل حفظ نتيجة تمرين واحد لا يجب أن يوقف التطبيق.
  }
  return state[lessonId][exerciseId];
}

function getExerciseResult(lessonId, exerciseId) {
  const state = loadExerciseState();
  return (state[lessonId] && state[lessonId][exerciseId]) || null;
}

function shuffleCopy(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function exerciseFeedbackNode(correct, explanationObj) {
  return el("div", { class: "quiz-feedback " + (correct ? "quiz-feedback-correct" : "quiz-feedback-incorrect") }, [
    el("strong", { class: "quiz-feedback-verdict", text: correct ? t("quizCorrect") : t("quizIncorrect") }),
    explanationObj ? el("p", { class: "quiz-feedback-explain", text: tr(explanationObj) }) : null
  ]);
}

// ---------- صح / خطأ ----------
function buildTrueFalseExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseTrueFalseLabel") }),
    el("p", { class: "quiz-question", text: tr(exercise.statement) })
  ]);

  const optionsWrap = el("div", { class: "quiz-options" });
  const render = (answeredValue) => {
    optionsWrap.replaceChildren();
    [true, false].forEach(value => {
      const isCorrectOption = value === exercise.correct;
      const isChosen = answeredValue === value;
      const classes = ["quiz-option"];
      if (answeredValue !== null) {
        if (isCorrectOption) classes.push("quiz-option-correct");
        else if (isChosen) classes.push("quiz-option-incorrect");
      }
      optionsWrap.appendChild(el("button", {
        type: "button",
        class: classes.join(" "),
        disabled: answeredValue !== null,
        onclick: () => {
          if (answeredValue !== null) return;
          const correct = value === exercise.correct;
          saveExerciseResult(lesson.id, exercise.id, { correct, answer: value });
          render(value);
          feedback.replaceChildren();
          feedback.appendChild(exerciseFeedbackNode(correct, exercise.explanation));
          feedback.classList.remove("hidden");
        }
      }, [value ? t("exerciseTrue") : t("exerciseFalse")]));
    });
  };

  const feedback = el("div", { class: "quiz-feedback hidden" });
  render(saved ? saved.answer : null);
  if (saved) {
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }

  wrap.appendChild(optionsWrap);
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- إكمال الفراغ ----------
function buildFillBlankExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const sentenceText = tr(exercise.sentence).replace("___", "______");
  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseFillBlankLabel") }),
    el("p", { class: "quiz-question", text: sentenceText })
  ]);

  const input = el("input", {
    type: "text",
    class: "practice-input exercise-fillblank-input",
    placeholder: t("exerciseFillBlankPlaceholder"),
    disabled: !!saved
  });
  if (saved) input.value = saved.answer || "";

  const feedback = el("div", { class: "quiz-feedback hidden" });
  const checkBtn = el("button", {
    type: "button",
    class: "btn-primary",
    text: t("exerciseCheckAnswer"),
    onclick: () => {
      const userAnswer = (input.value || "").trim().toLowerCase();
      const expected = tr(exercise.answer).trim().toLowerCase();
      const correct = userAnswer.length > 0 && userAnswer === expected;
      saveExerciseResult(lesson.id, exercise.id, { correct, answer: input.value });
      input.disabled = true;
      checkBtn.disabled = true;
      feedback.replaceChildren(exerciseFeedbackNode(correct, exercise.explanation));
      feedback.classList.remove("hidden");
    }
  });

  if (saved) {
    checkBtn.disabled = true;
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }

  wrap.appendChild(input);
  wrap.appendChild(checkBtn);
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- الترتيب ----------
// المستخدم كينقر على العناصر بالترتيب لي كيعتقد أنه صحيح (بدل drag/drop
// المعقد)؛ كل نقرة كتتيرقم وتتعطل، فتناسب الفأرة واللمس ولوحة المفاتيح
// (زر عادي، قابل للتفعيل بـ Enter/Space) بلا حاجة لـ drag events.
function buildOrderingExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseOrderingLabel") }),
    el("p", { class: "quiz-question", text: tr(exercise.prompt) })
  ]);

  const displayItems = saved ? exercise.items : shuffleCopy(exercise.items);
  const picks = saved ? saved.answer : [];
  const listWrap = el("div", { class: "quiz-options exercise-ordering-list" });
  const feedback = el("div", { class: "quiz-feedback hidden" });

  const isDone = !!saved;
  const render = () => {
    listWrap.replaceChildren();
    displayItems.forEach(item => {
      const pickIndex = picks.indexOf(item.id);
      const button = el("button", {
        type: "button",
        class: "quiz-option" + (pickIndex > -1 ? " quiz-option-correct" : ""),
        disabled: pickIndex > -1 || isDone,
        onclick: () => {
          picks.push(item.id);
          render();
          if (picks.length === exercise.items.length) {
            const correct = JSON.stringify(picks) === JSON.stringify(exercise.correctOrder);
            saveExerciseResult(lesson.id, exercise.id, { correct, answer: picks });
            feedback.replaceChildren(exerciseFeedbackNode(correct, exercise.explanation));
            feedback.classList.remove("hidden");
          }
        }
      }, [(pickIndex > -1 ? `${pickIndex + 1}. ` : "") + tr(item.text)]);
      listWrap.appendChild(button);
    });
  };
  render();

  if (saved) {
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }

  wrap.appendChild(listWrap);
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- المطابقة ----------
function buildMatchingExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseMatchingLabel") }),
    el("p", { class: "quiz-question", text: tr(exercise.prompt) })
  ]);

  const leftCol = el("div", { class: "exercise-matching-col" });
  const rightCol = el("div", { class: "exercise-matching-col" });
  const grid = el("div", { class: "exercise-matching-grid" }, [leftCol, rightCol]);
  const feedback = el("div", { class: "quiz-feedback hidden" });

  const matches = saved ? saved.answer : {}; // { leftId: rightId }
  let selectedLeft = null;
  const shuffledRight = saved ? exercise.pairs : shuffleCopy(exercise.pairs);
  const finished = () => Object.keys(matches).length === exercise.pairs.length;

  const checkAllCorrect = () => exercise.pairs.every(p => matches[p.id] === p.id);

  const render = () => {
    leftCol.replaceChildren();
    rightCol.replaceChildren();
    exercise.pairs.forEach(pair => {
      const isMatched = !!matches[pair.id];
      leftCol.appendChild(el("button", {
        type: "button",
        class: "quiz-option" + (isMatched ? " quiz-option-correct" : (selectedLeft === pair.id ? " quiz-option-incorrect" : "")),
        disabled: isMatched || finished(),
        onclick: () => { selectedLeft = pair.id; render(); }
      }, [tr(pair.left)]));
    });
    shuffledRight.forEach(pair => {
      const alreadyUsed = Object.values(matches).includes(pair.id);
      rightCol.appendChild(el("button", {
        type: "button",
        class: "quiz-option" + (alreadyUsed ? " quiz-option-correct" : ""),
        disabled: alreadyUsed || finished() || !selectedLeft,
        onclick: () => {
          if (!selectedLeft) return;
          matches[selectedLeft] = pair.id;
          selectedLeft = null;
          render();
          if (finished()) {
            const correct = checkAllCorrect();
            saveExerciseResult(lesson.id, exercise.id, { correct, answer: { ...matches } });
            feedback.replaceChildren(exerciseFeedbackNode(correct, exercise.explanation));
            feedback.classList.remove("hidden");
          }
        }
      }, [tr(pair.right)]));
    });
  };
  render();

  if (saved) {
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }

  wrap.appendChild(grid);
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- إجابة قصيرة (Short answer, self-assessed) ----------
// §9: نوع ناقص كان مطلوبًا صراحة. لا يوجد محرك NLP لتصحيح إجابات حرة
// تلقائيًا (ولن نتظاهر بوجوده — بنفس فلسفة projectEvaluationDisclaimer
// الموجودة أصلاً فـ app.js). النمط هنا: المستخدم يكتب إجابته، يضغط
// "أظهر إجابة نموذجية"، يقارن بنفسه، ثم يُقيّم صدقيًا هل أجاب بشكل صحيح.
// هذا أصدق من "تصحيح آلي" وهمي لسؤال مفتوح.
function buildShortAnswerExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseShortAnswerLabel") }),
    el("p", { class: "quiz-question", text: tr(exercise.prompt) })
  ]);

  const textarea = el("textarea", {
    class: "practice-input",
    placeholder: t("exerciseShortAnswerPlaceholder"),
    disabled: !!saved
  });
  if (saved) textarea.value = saved.answer || "";

  const modelAnswerBox = el("div", { class: "exercise-model-answer hidden" }, [
    el("span", { class: "panel-label", text: t("exerciseModelAnswerLabel") }),
    el("p", { class: "quiz-feedback-explain", text: tr(exercise.modelAnswer) })
  ]);

  const selfAssessRow = el("div", { class: "exercise-self-assess hidden" });
  const feedback = el("div", { class: "quiz-feedback hidden" });

  const finalize = (correct) => {
    saveExerciseResult(lesson.id, exercise.id, { correct, answer: textarea.value });
    selfAssessRow.classList.add("hidden");
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(correct, exercise.explanation));
  };

  const revealBtn = el("button", {
    type: "button",
    class: "btn-back",
    text: t("exerciseShowModelAnswer"),
    onclick: () => {
      modelAnswerBox.classList.remove("hidden");
      selfAssessRow.classList.remove("hidden");
      revealBtn.disabled = true;
      textarea.disabled = true;
    }
  });
  if (!textarea.value.trim() && !saved) revealBtn.disabled = false;

  selfAssessRow.appendChild(el("button", {
    type: "button",
    class: "btn-primary",
    text: t("exerciseIGotItRight"),
    onclick: () => finalize(true)
  }));
  selfAssessRow.appendChild(el("button", {
    type: "button",
    class: "btn-back",
    text: t("exerciseNeedMorePractice"),
    onclick: () => finalize(false)
  }));

  if (saved) {
    modelAnswerBox.classList.remove("hidden");
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }

  wrap.appendChild(textarea);
  wrap.appendChild(revealBtn);
  wrap.appendChild(modelAnswerBox);
  wrap.appendChild(selfAssessRow);
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- تمرين برمجي حقيقي (Code exercise, auto-graded for JS) ----------
// §9: يشغّل فعليًا كود JavaScript الذي يكتبه المستخدم فـ نفس المتصفح
// (بلا أي إرسال لأي خادم) ويقارن مخرجاته باختبارات حقيقية — تصحيح آلي
// حقيقي، لا تظاهر. مقصور على JavaScript فقط لأن تشغيل بايثون فـ المتصفح
// يتطلب اعتمادية ثقيلة (Pyodide) تخالف مبدأ "عدم الإفراط الهندسي" (§49)
// لهذه المرحلة؛ لغات أخرى تتحوّل تلقائيًا لوضع "أظهر الحل" الصادق بدل
// وضع تنفيذ لا يعمل فعليًا.
function runJsFunctionAgainstTests(userCode, functionName, testCases, timeoutMs = 1500) {
  // User code is intentionally executable, but must never execute in Masar's
  // origin. A sandboxed iframe gives it an opaque origin, so it cannot read or
  // mutate localStorage, the DOM, cookies, or parent-page JS. It is also
  // disposable and time-limited to stop accidental infinite loops.
  if (typeof document === "undefined" || typeof window === "undefined") {
    return Promise.resolve({ ok: false, error: "Code execution requires a browser environment." });
  }

  return new Promise(resolve => {
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;border:0;";

    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      frame.remove();
    };
    const finish = outcome => {
      cleanup();
      resolve(outcome);
    };
    const onMessage = event => {
      if (event.source !== frame.contentWindow || !event.data || event.data.kind !== "masar-code-result") return;
      finish(event.data.outcome);
    };
    const timer = setTimeout(() => {
      finish({ ok: false, error: "Code execution timed out. Check for an infinite loop or very expensive computation." });
    }, timeoutMs);

    window.addEventListener("message", onMessage);
    frame.srcdoc = `<!doctype html><meta charset="utf-8"><script>
      window.addEventListener("message", function(event) {
        if (!event.data || event.data.kind !== "masar-run-code") return;
        const payload = event.data;
        let outcome;
        try {
          const factory = new Function(payload.code + "\\nreturn typeof " + payload.functionName + " === 'function' ? " + payload.functionName + " : null;");
          const fn = factory();
          if (typeof fn !== "function") throw new Error('Function is not defined: ' + payload.functionName);
          const results = payload.testCases.map(function(testCase) {
            try {
              const actual = fn.apply(null, testCase.args);
              const passed = JSON.stringify(actual) === JSON.stringify(testCase.expected);
              return { passed: passed, actual: actual, expected: testCase.expected, args: testCase.args };
            } catch (runtimeErr) {
              return { passed: false, error: runtimeErr && runtimeErr.message ? runtimeErr.message : String(runtimeErr), args: testCase.args, expected: testCase.expected };
            }
          });
          outcome = { ok: true, results: results, allPassed: results.every(function(r) { return r.passed; }) };
        } catch (err) {
          outcome = { ok: false, error: err && err.message ? err.message : String(err) };
        }
        try {
          parent.postMessage({ kind: "masar-code-result", outcome: outcome }, "*");
        } catch (postErr) {
          parent.postMessage({ kind: "masar-code-result", outcome: { ok: false, error: "Could not return the exercise result." } }, "*");
        }
      });
    <\/script>`;
    document.body.appendChild(frame);
    frame.addEventListener("load", () => {
      frame.contentWindow.postMessage({ kind: "masar-run-code", code: userCode, functionName, testCases }, "*");
    }, { once: true });
  });
}
function buildCodeExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const isRunnable = (exercise.codeLang || "javascript") === "javascript" && exercise.functionName && Array.isArray(exercise.testCases);

  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseCodeLabel") }),
    el("p", { class: "quiz-question", text: tr(exercise.prompt) })
  ]);

  const editor = el("textarea", {
    class: "practice-input exercise-code-editor",
    style: "min-height:120px;font-family:'Courier New',monospace;direction:ltr;text-align:left;",
    spellcheck: "false"
  });
  editor.value = saved ? (saved.answer || exercise.starterCode || "") : (exercise.starterCode || "");
  if (saved) editor.disabled = true;

  const resultsBox = el("div", { class: "exercise-code-results hidden" });
  const feedback = el("div", { class: "quiz-feedback hidden" });

  const renderRun = (outcome) => {
    resultsBox.classList.remove("hidden");
    resultsBox.replaceChildren();
    if (!outcome.ok) {
      resultsBox.appendChild(el("p", { class: "lesson-mistake", text: outcome.error }));
      return;
    }
    outcome.results.forEach((r, idx) => {
      const line = r.passed
        ? t("exerciseTestPassed", { index: idx + 1 })
        : (r.error
          ? t("exerciseTestErrored", { index: idx + 1, error: r.error })
          : t("exerciseTestFailed", { index: idx + 1, expected: JSON.stringify(r.expected), actual: JSON.stringify(r.actual) }));
      resultsBox.appendChild(el("p", { class: r.passed ? "practice-feedback-status" : "lesson-mistake", text: line }));
    });
  };

  const finishRunnable = async () => {
    const runBtn = wrap.querySelector(".exercise-code-run-btn");
    if (runBtn) runBtn.disabled = true;
    const outcome = await runJsFunctionAgainstTests(editor.value, exercise.functionName, exercise.testCases);
    renderRun(outcome);
    if (outcome.ok) {
      saveExerciseResult(lesson.id, exercise.id, { correct: outcome.allPassed, answer: editor.value });
      feedback.classList.remove("hidden");
      feedback.replaceChildren(exerciseFeedbackNode(outcome.allPassed, exercise.explanation));
      if (outcome.allPassed) editor.disabled = true;
    }
    if (runBtn) runBtn.disabled = !!(outcome.ok && outcome.allPassed);
  };

  if (isRunnable) {
    const runBtn = el("button", { type: "button", class: "btn-primary exercise-code-run-btn", text: t("exerciseRunCode"), onclick: finishRunnable, disabled: !!saved });
    wrap.appendChild(editor);
    wrap.appendChild(runBtn);
    wrap.appendChild(resultsBox);
  } else {
    // لغة غير قابلة للتنفيذ محليًا: وضع "أظهر الحل" الصادق بدل تنفيذ وهمي.
    const solutionBox = el("div", { class: "exercise-model-answer hidden" }, [
      el("pre", { class: "lesson-code" }, [el("code", { class: `language-${exercise.codeLang || "plaintext"}`, text: exercise.solutionCode || "" })])
    ]);
    const revealBtn = el("button", {
      type: "button", class: "btn-back", text: t("exerciseShowSolution"),
      onclick: () => {
        solutionBox.classList.remove("hidden");
        selfBtns.classList.remove("hidden");
        revealBtn.disabled = true;
      }
    });
    const selfBtns = el("div", { class: "exercise-self-assess hidden" }, [
      el("button", { type: "button", class: "btn-primary", text: t("exerciseIGotItRight"), onclick: () => {
        saveExerciseResult(lesson.id, exercise.id, { correct: true, answer: editor.value });
        selfBtns.classList.add("hidden");
        feedback.classList.remove("hidden");
        feedback.replaceChildren(exerciseFeedbackNode(true, exercise.explanation));
      }}),
      el("button", { type: "button", class: "btn-back", text: t("exerciseNeedMorePractice"), onclick: () => {
        saveExerciseResult(lesson.id, exercise.id, { correct: false, answer: editor.value });
        selfBtns.classList.add("hidden");
        feedback.classList.remove("hidden");
        feedback.replaceChildren(exerciseFeedbackNode(false, exercise.explanation));
      }})
    ]);
    wrap.appendChild(editor);
    wrap.appendChild(revealBtn);
    wrap.appendChild(solutionBox);
    wrap.appendChild(selfBtns);
  }

  if (saved) {
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- تمرين تصحيح الأخطاء (Debugging) ----------
// §9: يعرض كودًا يحتوي خطأً حقيقيًا مع سياق (buggyCode)، ويطلب من
// المستخدم تحديد/إصلاح الخطأ قبل كشف الإصلاح الصحيح — بنفس فلسفة عدم
// كشف الحل فورًا المتّبعة أصلاً فـ Masar Mentor (Hint → Explanation).
function buildDebuggingExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseDebuggingLabel") }),
    el("p", { class: "quiz-question", text: tr(exercise.prompt) }),
    el("pre", { class: "lesson-code" }, [el("code", { class: `language-${exercise.codeLang || "plaintext"}`, text: exercise.buggyCode || "" })])
  ]);

  const answerBox = el("textarea", {
    class: "practice-input",
    placeholder: t("exerciseDebuggingPlaceholder"),
    disabled: !!saved
  });
  if (saved) answerBox.value = saved.answer || "";

  const fixBox = el("div", { class: "exercise-model-answer hidden" }, [
    el("span", { class: "panel-label", text: t("exerciseShowFix") }),
    el("pre", { class: "lesson-code" }, [el("code", { class: `language-${exercise.codeLang || "plaintext"}`, text: exercise.fixedCode || "" })])
  ]);
  const selfBtns = el("div", { class: "exercise-self-assess hidden" });
  const feedback = el("div", { class: "quiz-feedback hidden" });

  const finalize = (correct) => {
    saveExerciseResult(lesson.id, exercise.id, { correct, answer: answerBox.value });
    selfBtns.classList.add("hidden");
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(correct, exercise.explanation));
  };

  const revealBtn = el("button", {
    type: "button",
    class: "btn-back",
    text: t("exerciseShowFix"),
    onclick: () => {
      fixBox.classList.remove("hidden");
      selfBtns.classList.remove("hidden");
      revealBtn.disabled = true;
      answerBox.disabled = true;
    }
  });

  selfBtns.appendChild(el("button", { type: "button", class: "btn-primary", text: t("exerciseIGotItRight"), onclick: () => finalize(true) }));
  selfBtns.appendChild(el("button", { type: "button", class: "btn-back", text: t("exerciseNeedMorePractice"), onclick: () => finalize(false) }));

  if (saved) {
    fixBox.classList.remove("hidden");
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }

  wrap.appendChild(answerBox);
  wrap.appendChild(revealBtn);
  wrap.appendChild(fixBox);
  wrap.appendChild(selfBtns);
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- سيناريو قرار (Scenario / decision-making) ----------
function buildScenarioExercise(lesson, exercise) {
  const saved = getExerciseResult(lesson.id, exercise.id);
  const wrap = el("div", { class: "exercise-box" }, [
    el("span", { class: "quiz-label", text: t("exerciseScenarioLabel") }),
    el("p", { class: "exercise-scenario-context", text: tr(exercise.context) }),
    el("p", { class: "quiz-question", text: tr(exercise.prompt) })
  ]);

  const optionsWrap = el("div", { class: "quiz-options" });
  const feedback = el("div", { class: "quiz-feedback hidden" });

  const render = (answeredId) => {
    optionsWrap.replaceChildren();
    exercise.options.forEach(option => {
      const isCorrectOption = option.id === exercise.correctId;
      const isChosen = option.id === answeredId;
      const classes = ["quiz-option"];
      if (answeredId) {
        if (isCorrectOption) classes.push("quiz-option-correct");
        else if (isChosen) classes.push("quiz-option-incorrect");
      }
      optionsWrap.appendChild(el("button", {
        type: "button",
        class: classes.join(" "),
        disabled: !!answeredId,
        onclick: () => {
          if (answeredId) return;
          const correct = option.id === exercise.correctId;
          saveExerciseResult(lesson.id, exercise.id, { correct, answer: option.id });
          render(option.id);
          feedback.replaceChildren(exerciseFeedbackNode(correct, exercise.explanation));
          feedback.classList.remove("hidden");
        }
      }, [tr(option.text)]));
    });
  };

  render(saved ? saved.answer : null);
  if (saved) {
    feedback.classList.remove("hidden");
    feedback.replaceChildren(exerciseFeedbackNode(saved.correct, exercise.explanation));
  }

  wrap.appendChild(optionsWrap);
  wrap.appendChild(feedback);
  return wrap;
}

// ---------- نقطة الدخول ----------
// تُستدعى من app.js (buildLessonItem) عبر فحص دفاعي على window.
window.masarBuildExerciseBoxes = function (lesson) {
  if (!lesson.exercises || !Array.isArray(lesson.exercises) || !lesson.exercises.length) return null;

  const builders = {
    trueFalse: buildTrueFalseExercise,
    fillBlank: buildFillBlankExercise,
    ordering: buildOrderingExercise,
    matching: buildMatchingExercise,
    scenario: buildScenarioExercise
  };

  const nodes = lesson.exercises
    .map(exercise => {
      const builder = builders[exercise.type];
      if (!builder) return null; // نوع غير معروف: نتجاهله بصمت بدل كسر الصفحة
      try {
        return builder(lesson, exercise);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  if (!nodes.length) return null;
  return el("div", { class: "exercise-list" }, nodes);
};

// عدد التمارين الموسّعة المُجابة بشكل صحيح — يُستعمل اختياريًا فـ
// حسابات أخرى (XP، أدلة المهارة) دون إجبار أي كود آخر على معرفة تفاصيل
// هذا الملف.
window.masarCountCorrectExercises = function (lessonIds = null) {
  const state = loadExerciseState();
  const ids = lessonIds ? new Set(lessonIds) : null;
  let count = 0;
  Object.keys(state).forEach(lessonId => {
    if (ids && !ids.has(lessonId)) return;
    Object.values(state[lessonId]).forEach(entry => {
      if (entry && entry.correct) count++;
    });
  });
  return count;
};
