import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

registerServiceWorker();

const rootElement = document.getElementById("root");

if (!!Office.context.host && Office.context.host === "Outlook") {
  Office.initialize = () => {
    ReactDOM.render(<App />, rootElement);
  };
} else {
  ReactDOM.render(<div>This app is not run inside an Office Outlook Context</div>, rootElement);
}