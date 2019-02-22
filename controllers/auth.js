import { renderScreen } from "../utils/ssr";

const error = async (req, res) => {
  const initialData = {
    title: "Autenticação Error"
  };
  renderScreen(req, res, "Error", initialData);
};

export default {
  error
};
