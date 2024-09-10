import Login from "../components/shared/Login";
const Home = () => {
  return (
      <div>
        <h1>Home Page</h1>
        <p>
          To create a comment Login and after that in the navbar, select
            <strong>'create comment'</strong> or you can view existing
            entries in the <strong>'comment list'</strong>.
        </p>
        <Login />
      </div>
  );
};

export default Home;
