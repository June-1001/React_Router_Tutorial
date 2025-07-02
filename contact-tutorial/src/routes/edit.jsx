import { Form, useLoaderData, redirect, useNavigate, useRevalidator } from "react-router-dom";
import { updateContact, deleteContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const handleCancel = async () => {
    const form = document.getElementById("contact-form");
    const formData = new FormData(form);
    let allEmpty = true;

    for (const value of formData.values()) {
      if (value.trim() !== "") {
        allEmpty = false;
        break;
      }
    }

    if (allEmpty) {
      // 모든 데이터가 비어있으면 데이터 제거
      await deleteContact(contact.id);
      // 연락처 리스트 다시 불러오기
      revalidator.revalidate();
      navigate("/");
      return;
    }

    navigate(-1);
  };

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input type="text" name="twitter" placeholder="@jack" defaultValue={contact?.twitter} />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact?.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            handleCancel();
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
