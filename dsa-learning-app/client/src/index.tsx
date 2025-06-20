import { Card, CardContent, CardHeader, CardTitle } from "./styles/card";
import { Button } from "./styles/button";
import { useNavigate } from "react-router-dom";

const languages = ['C++', 'Java', 'Python', 'JavaScript'];

const Index = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (language: string) => {
    navigate(`/difficulty/${language}`);
  };

  return (
    <div className="min-h-screen bg-light d-flex flex-column justify-content-center align-items-center p-4">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary fw-bold mb-3">Choose Your Programming Language</h1>
        <p className="lead text-muted">Select a language and start learning DSA.</p>
      </div>

      <div className="row w-100 justify-content-center">
        {languages.map((language) => (
          <div key={language} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <Card 
              className="h-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              onClick={() => handleLanguageSelect(language)}
            >
              <CardHeader className="text-center">
                <CardTitle className="h3">{language}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted">Click to start questions in {language}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;