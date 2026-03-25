import { client, pool } from "./client";

export type NewQuiz = {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  introduction?: string;
  icon?: string;
  sourceDocument?: string;
  questionCount?: number;
  createdBy?: string;
  questions: NewQuestion[];
  isActive : boolean;
};

export type NewQuestion = {
  id?: string;
  question: string;
  explanation?: string;
  answers: NewAnswer[];
  isActive : boolean;
};

export type NewAnswer = {
  id?: string;
  text: string;
  isCorrect: boolean;
};

// GET — tous les quiz avec leurs questions et réponses
export async function getAllQuizzesFromDb() {
  const result = await client.query(`
    SELECT 
      qz.id AS quiz_id, qz.title, qz.slug, qz.description, qz.introduction,
      qz.icon, qz.source_document, qz.question_count, qz.createdby,qz.isActive as qz_active,
      qt.id AS question_id, qt.question, qt.explanation, qt.sort_order AS q_order,qt.isActive as q_active,
      an.id AS answer_id, an.text, an.is_correct, an.sort_order AS a_order
    FROM quizzes qz
    LEFT JOIN questions qt ON qt.quiz_id = qz.id
    LEFT JOIN answers an ON an.question_id = qt.id
    ORDER BY qz.created_at DESC, qt.sort_order, an.sort_order
  `);

  // Reconstruction quiz > questions > answers
  const quizzesMap = new Map<string, any>();
  for (const row of result.rows) {
    if (!quizzesMap.has(row.quiz_id)) {
      quizzesMap.set(row.quiz_id, {
        id: row.quiz_id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        introduction: row.introduction,
        icon: row.icon,
        sourceDocument: row.source_document,
        questionCount: row.question_count,
        createdBy: row.createdby,
        isActive: row.qz_active,
        questions: [],
      });
    }

    const quiz = quizzesMap.get(row.quiz_id);

    if (row.question_id) {
      let question = quiz.questions.find((q: any) => q.id === row.question_id);
      if (!question) {
        question = {
          id: row.question_id,
          question: row.question,
          explanation: row.explanation,
          isActive: row.q_active,
          answers: [],
        };
        quiz.questions.push(question);
      }
      if (row.answer_id) {
        question.answers.push({
          id: row.answer_id,
          text: row.text,
          isCorrect: row.is_correct,
          isActive: true,
        });
      }
    }
  }

  return [...quizzesMap.values()];
}
// POST — créer un quiz + questions + answers (transaction)
export async function createQuizInDb(quiz: NewQuiz) {
  // client.query ne supporte pas les transactions, on utilise le pool natif
   
  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    const quizResult = await conn.query(
      `INSERT INTO quizzes (title, slug, description, introduction, icon, source_document, question_count, isActive, createdby)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [quiz.title, quiz.slug, quiz.description, quiz.introduction,
       quiz.icon, quiz.sourceDocument, quiz.questionCount,quiz.isActive, quiz.createdBy]
    );
    const savedQuiz = quizResult.rows[0];

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      const qResult = await conn.query(
        `INSERT INTO questions (quiz_id, question, explanation, isActive,sort_order)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [savedQuiz.id, q.question, q.explanation, q.isActive,i]
      );
      const savedQuestion = qResult.rows[0];

      for (let j = 0; j < q.answers.length; j++) {
        const a = q.answers[j];
        await conn.query(
          `INSERT INTO answers (question_id, text, is_correct, sort_order)
           VALUES ($1,$2,$3,$4)`,
          [savedQuestion.id, a.text, a.isCorrect, j]
        );
      }
    }

    await conn.query("COMMIT");
    return { ...savedQuiz, questions: quiz.questions };
  } catch (err) {
    await conn.query("ROLLBACK");
    throw err;
  } finally {
    conn.release();
  }
}

// PUT — mettre à jour un quiz (supprime et réinsère les questions)
export async function updateQuizInDb(quiz: NewQuiz) {
  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    await conn.query(
      `UPDATE quizzes SET title=$1, slug=$2, description=$3, introduction=$4,
       icon=$5, source_document=$6, question_count=$7, updated_at=NOW(), isActive = $8
       WHERE id=$9`,
      [quiz.title, quiz.slug, quiz.description, quiz.introduction,
       quiz.icon, quiz.sourceDocument, quiz.questionCount, quiz.isActive,quiz.id]
    );

    // Suppression des anciennes questions (CASCADE supprime aussi les answers)
    await conn.query("DELETE FROM questions WHERE quiz_id = $1", [quiz.id]);

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      const qResult = await conn.query(
        `INSERT INTO questions (quiz_id, question, explanation, sort_order,isActive)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [quiz.id, q.question, q.explanation, i,q.isActive]
      );
      const savedQuestion = qResult.rows[0];

      for (let j = 0; j < q.answers.length; j++) {
        const a = q.answers[j];
        await conn.query(
          `INSERT INTO answers (question_id, text, is_correct, sort_order)
           VALUES ($1,$2,$3,$4)`,
          [savedQuestion.id, a.text, a.isCorrect, j]
        );
      }
    }

    await conn.query("COMMIT");
    return quiz;
  } catch (err) {
    await conn.query("ROLLBACK");
    throw err;
  } finally {
    conn.release();
  }
}

// DELETE — supprimer un quiz (CASCADE supprime questions + answers)
export async function deleteQuizFromDb(id: string) {
  const result = await client.query(
    "DELETE FROM quizzes WHERE id = $1",
    [id]
  );
  return result;
}

export async function toggleQuizActiveInDb(id: string, isActive: boolean) {
  try {
    await client.query(
      "UPDATE quizzes SET isActive = $1, updated_at = NOW() WHERE id = $2",
      [isActive, id]
    );
  } catch (err) {
    console.error("Erreur toggleQuizActiveInDb", err);
    throw err;
  }
}

export async function toggleQuestionActiveInDb(id: string, isActive: boolean) {
  try {
    await client.query(
      "UPDATE questions SET isActive = $1 WHERE id = $2",
      [isActive, id]
    );
  } catch (err) {
    console.error("Erreur toggleQuestionActiveInDb", err);
    throw err;
  }
}

export async function deleteQuestionFromDb(id: string) {
  try {
    // CASCADE supprime automatiquement les answers associées
    await client.query("DELETE FROM questions WHERE id = $1", [id]);
  } catch (err) {
    console.error("Erreur deleteQuestionFromDb", err);
    throw err;
  }
}

export async function getQuizBySlugFromDb(slug: string) {
   const quizResult = await client.query(`
    SELECT qz.id, qz.title, qz.slug, qz.description, qz.introduction,
           qz.icon, qz.source_document, qz.question_count, qz.createdby, qz.isActive
    FROM quizzes qz
    WHERE qz.slug = $1 AND qz.isActive = true
  `, [slug]);

  if (quizResult.rows.length === 0) return null;
  const quizData = quizResult.rows[0];

  // 2. Sélectionner les questions aléatoirement selon questionCount
  const questionsResult = await client.query(`
    SELECT qt.id AS question_id, qt.question, qt.explanation, qt.isActive
    FROM questions qt
    WHERE qt.quiz_id = $1 AND qt.isActive = true
    ORDER BY RANDOM()
    LIMIT $2
  `, [quizData.id, quizData.question_count]);

  if (questionsResult.rows.length === 0) {
    return { ...quizData, questions: [] };
  }

  // 3. Récupérer les answers uniquement pour ces questions sélectionnées
  const questionIds = questionsResult.rows.map(q => q.question_id);
  const answersResult = await client.query(`
    SELECT an.id AS answer_id, an.question_id, an.text, an.is_correct
    FROM answers an
    WHERE an.question_id = ANY($1::uuid[])
    ORDER BY an.sort_order
  `, [questionIds]);

  // 4. Reconstruction quiz > questions > answers
  const quiz: any = {
    id: quizData.id,
    title: quizData.title,
    slug: quizData.slug,
    description: quizData.description,
    introduction: quizData.introduction,
    icon: quizData.icon,
    sourceDocument: quizData.source_document,
    questionCount: quizData.question_count,
    createdBy: quizData.createdby,
    isActive: quizData.isactive,
    questions: questionsResult.rows.map(q => ({
      id: q.question_id,
      question: q.question,
      explanation: q.explanation,
      isActive: q.isactive,
      answers: answersResult.rows
        .filter(a => a.question_id === q.question_id)
        .map(a => ({
          id: a.answer_id,
          text: a.text,
          isCorrect: a.is_correct,
        })),
    })),
  };

  return quiz;
}