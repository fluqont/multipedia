import Form from "../ui/Form";
import InputField from "../ui/InputField";
import atomics from "../atomics.module.css";

export default function SignUp() {
  return (
    <section className={atomics["centered-section"]}>
      <h1>sign up</h1>
      <Form>
        <InputField id="username" />
        <InputField id="password" inputType="password" />
      </Form>
    </section>
  );
}
