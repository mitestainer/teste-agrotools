window.onload = () => {
	getQuestions();
};

let numberOfQuestions = 1;

// Show and close modals

const closeModal = () => {
	document.querySelector(".modal-wrapper").classList.toggle("show");
	setTimeout(() => {
		document
			.querySelector("body")
			.removeChild(document.querySelector(".modal-wrapper"));
	}, 250);
};

const showModal = (modalContent) => {
	const modalWrapper = document.createElement("div");
	modalWrapper.className = "modal-wrapper";

	modalWrapper.appendChild(modalContent);

	document.querySelector("body").appendChild(modalWrapper);

	setTimeout(() => {
		modalWrapper.classList.toggle("show");
	}, 100);
};

// end

const createInputField = (name, labelText, placeholder, isRemovable) => {
	const inputArea = document.createElement("div");
	inputArea.className = "input-area";

	const label = document.createElement("label");
	label.htmlFor = `input_${name}`;
	label.innerText = labelText;
	inputArea.appendChild(label);

	const input = document.createElement("input");
	input.id = `input_${name}`;
	input.className = "input-element";
	input.type = "text";
	input.placeholder = !placeholder ? "" : placeholder;
	input.name = name;
	inputArea.appendChild(input);

	if (isRemovable && name.includes("question") && !name.includes("1")) {
		const removableTag = document.createElement("span");
		removableTag.innerText = "Remover";
		removableTag.className = "tag-remove";
		removableTag.addEventListener("click", (e) => {
			const parent = e.target.parentNode;
			const grandParent = parent.parentNode;
			grandParent.removeChild(parent);
			numberOfQuestions--;
		});
		inputArea.appendChild(removableTag);
	}

	return inputArea;
};

// Get and show questions start

const createAnswerModal = async (id) => {
	let question = await fetch(`http://localhost:3000/questions/${id}`);
	question = await question.json();

	const questionModal = document.createElement("div");
	questionModal.className = "modal";

	const closeButton = document.createElement("button");
	closeButton.id = "modal-close";
	closeButton.className = "button-close";
	closeButton.innerText = "Fechar";
	closeButton.addEventListener("click", () => closeModal());
	questionModal.appendChild(closeButton);

	const p = document.createElement("p");
	p.innerHTML = question.title;
	p.className = 'p-title'
	questionModal.appendChild(p);

	const form = document.createElement("form");

	form.appendChild(createInputField("author", "Autor", "Seu nome"));

	for (const [index, q] of Object.entries(question.questions)) {
		form.appendChild(createInputField(`question_${index}`, q, "Responda aqui"));
	}

	const button = document.createElement("button");
	button.className = "button-action";
	button.innerText = "Enviar";
	button.type = "submit";
	form.appendChild(button);

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		try {
			const values = [...document.querySelectorAll(".input-element")];
			if (values.some((item) => !item.value)) {
				alert("Por favor preencha tudo");
				return;
			}
			const output = {
				question_id: id,
				answered_by: values.find((input) => input.id.includes("author")).value,
				answers: {}
			};
			const arr = [...document.querySelectorAll("form input")].filter((input) =>
				input.name.includes("question")
			);
			arr.forEach((answer, index) => {
				output.answers[index] = answer.value;
			});
			await fetch("http://localhost:3000/answers", {
				method: "POST",
				body: JSON.stringify(output),
				headers: { "Content-Type": "application/json" }
			});
			closeModal();
			location.href = "";
		} catch (error) {
			console.error(error);
		}
	});

	questionModal.appendChild(form);

	return questionModal;
};

const createAnswersListModal = async answerId => {
	let answersList = await fetch(`http://localhost:3000/answers/${answerId}`);
	answersList = await answersList.json();

	const answersListModal = document.createElement("div");
	answersListModal.className = "modal";

	const closeButton = document.createElement("button");
	closeButton.id = "modal-close";
	closeButton.className = "button-close";
	closeButton.innerText = "Fechar";
	closeButton.addEventListener("click", () => closeModal());
	answersListModal.appendChild(closeButton);

	const p = document.createElement("p");
	p.innerText = 'Respostas anteriores'
	p.className = 'p-title'
	answersListModal.appendChild(p);

	const answersWrapper = document.createElement('div')
	answersWrapper.className = 'answers-wrapper'

	if (answersList.msg === 'No such id.') {
		const answerItem = document.createElement('div')
		answerItem.className = 'answer-item'
		const p = document.createElement('p')
		p.innerText = "Esse questionário ainda não foi repsondido por ninguém. Seja o primeiro!"
		answerItem.appendChild(p)
		answersWrapper.appendChild(answerItem)
	} else {
		answersList.forEach(async answer => {
			const answerItem = document.createElement('div')
			answerItem.className = 'answer-item'
			const { question_id, answers, answered_by, answered_at } = answer
			let question = await fetch(`http://localhost:3000/questions/${question_id}`);
			question = await question.json()
			const p = document.createElement('p')
			p.innerText = `Respondido por ${answered_by} em ${answered_at}`
			answerItem.appendChild(p)
			for (const [index, answer] of Object.entries(answers)) {
				const p = document.createElement('p')
				p.innerText = `${question.questions[index]}: ${answer}`
				answerItem.appendChild(p)
			}
			answersWrapper.appendChild(answerItem)
		})
	}

	answersListModal.appendChild(answersWrapper)

	return answersListModal;
}

const createPtag = (text, className) => {
	const p = document.createElement("p");
	p.className = className;
	p.innerText = text;
	return p;
};

const createQuestionCard = (data) => {
	const { id, title, user, time } = data
	const card = document.createElement("div");
	card.id = id;
	card.className = "question-card";
	card.appendChild(createPtag(title, "title"));
	card.appendChild(
		createPtag(`Criado por ${user} em ${time}`, "user")
	);

	const buttonsWrapper = document.createElement("div");

	const answerButton = document.createElement("button");
	answerButton.className = 'button-action'
	answerButton.innerText = "Responder";
	answerButton.addEventListener("click", async () => {
		const answerModal = await createAnswerModal(id);
		showModal(answerModal);
	});
	buttonsWrapper.appendChild(answerButton);

	const viewAnswersButton = document.createElement("button");
	viewAnswersButton.className = 'button-action'
	viewAnswersButton.innerText = "Ver respostas";
	viewAnswersButton.addEventListener("click", async () => {
		const answersListModal = await createAnswersListModal(id)
		showModal(answersListModal)
	});
	buttonsWrapper.appendChild(viewAnswersButton);

	card.appendChild(buttonsWrapper);

	return card;
};

const getQuestions = async () => {
	try {
		let questions = await fetch("http://localhost:3000/questions");
		questions = await questions.json();
		const numOfQuestions = questions.length;
		const topArea = document.querySelector("#top-area");
		if (!numOfQuestions) {
			topArea.appendChild(
				createPtag(
					"Não há nenhum questionário disponível. Crie um.",
					"no-questions"
				)
			);
		} else {
			topArea.appendChild(
				createPtag(
					`${numOfQuestions} questionário${numOfQuestions > 1 ? "s" : ""
					} disponíve${numOfQuestions > 1 ? "is" : "l"}. Clique ${numOfQuestions > 1 ? "em um" : ""
					} para responder.`,
					"no-questions"
				)
			);
			questions.forEach((question) => {
				const displayArea = document.querySelector("#display-area");
				const questionCard = createQuestionCard(question);
				displayArea.appendChild(questionCard);
			});
		}
	} catch (error) {
		console.error(error);
	}
};

// Get and show questions end

// Create question modal start

document.querySelector("#create").addEventListener("click", () => {
	showModal(createQuestionModal());
});

const createQuestionModal = () => {
	const modal = document.createElement("div");
	modal.className = "modal";

	const closeButton = document.createElement("button");
	closeButton.id = "modal-close";
	closeButton.className = "button-close";
	closeButton.innerText = "Fechar";
	closeButton.addEventListener("click", () => {
		closeModal();
		numberOfQuestions = 1;
	});
	modal.appendChild(closeButton);

	const p = document.createElement("p");
	p.innerText = "Criar novo questionário";
	p.className = "p-title";
	modal.appendChild(p);

	const form = document.createElement("form");
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		try {
			const values = [...document.querySelectorAll(".input-element")];
			if (values.some((item) => !item.value)) {
				alert("Por favor preencha tudo");
				return;
			}
			const output = {
				title: values.find((input) => input.id.includes("title")).value,
				user: values.find((input) => input.id.includes("user")).value,
				questions: {}
			};
			const arr = [...document.querySelectorAll("form input")].filter((input) =>
				input.name.includes("question")
			);
			arr.forEach((question, index) => {
				output.questions[index] = question.value;
			});
			await fetch("http://localhost:3000/questions", {
				method: "POST",
				body: JSON.stringify(output),
				headers: { "Content-Type": "application/json" }
			});
			closeModal();
			location.href = "";
		} catch (error) {
			console.error(error);
		}
	});

	const formWrapper = document.createElement("div");
	formWrapper.className = "form-wrapper";

	formWrapper.appendChild(
		createInputField("title", "Título", "Dê um título para seu questionário")
	);
	formWrapper.appendChild(
		createInputField("user", "Usuário", "Insira seu nome de usuário")
	);

	const questionsWrapper = document.createElement("div");

	questionsWrapper.appendChild(
		createInputField(
			`question_${numberOfQuestions}`,
			`Pergunta ${numberOfQuestions}`,
			"Insira aqui uma pergunta para o questionário"
		)
	);
	formWrapper.appendChild(questionsWrapper);

	form.appendChild(formWrapper);

	const formUnderDiv = document.createElement("div");
	formUnderDiv.className = "form-under-div";

	const addMoreQuestionsButton = document.createElement("button");
	addMoreQuestionsButton.className = "button-action";
	addMoreQuestionsButton.innerText = "Adicionar mais perguntas";
	addMoreQuestionsButton.type = "button";
	addMoreQuestionsButton.addEventListener("click", () => {
		numberOfQuestions++;
		questionsWrapper.appendChild(
			createInputField(
				`question_${numberOfQuestions}`,
				`Pergunta ${numberOfQuestions}`,
				"Insira aqui uma pergunta para o questionário",
				true
			)
		);
	});
	formUnderDiv.appendChild(addMoreQuestionsButton);

	const saveButton = document.createElement("button");
	saveButton.innerText = "Salvar";
	saveButton.className = "button-action";
	saveButton.type = "submit";
	formUnderDiv.appendChild(saveButton);

	form.appendChild(formUnderDiv);

	modal.appendChild(form);

	return modal;
};

  // Create question modal end
