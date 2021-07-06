import Button from "../../components/Button/Button";

const Landing = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        Notre entreprise, spécialisée dans la grande distribution, est en pleine
        expansion. Nous avons actuellement plus de 600 collaborateurs.
        <br />
        Ce site est fait pour vous rassembler!
      </div>
      <Button title="Inscription" />
      <Button title="Connexion" />
    </div>
  );
};
export default Landing;
