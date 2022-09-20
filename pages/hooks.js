import { Fragment, useEffect, useState } from "react";

const useCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log(`useCounter`);
      setCount((c) => c + 1);
    }, 1000);
  }, []);

  return count;
};

const SimpleComponent = () => {
  return <h1>SimpleComponent</h1>;
};

export default function Hooks() {
  const count = useCounter();
  return (
    <Fragment>
      <h1>Hello World - {count}</h1>
      <SimpleComponent />
    </Fragment>
  );
}
