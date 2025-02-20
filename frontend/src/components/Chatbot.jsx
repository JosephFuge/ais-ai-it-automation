
export default function Chatbot() {
	return (<iframe
		title="chatbot"
		src="http://127.0.0.1:8000/chainlit"
		id="the-frame"
		data-cy="the-frame"
		width="100%"
		height="500px"
	></iframe>
	);
};
