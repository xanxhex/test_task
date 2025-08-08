
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getPositions } from "@/api/position";
import { getToken } from "@/api/auth";
import { createUser } from "@/api/users";
import "./PostForm.scss";


const DESIRED_POSITIONS = ["Lawyer", "Security", "Designer", "Content manager"];


function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("380")) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith("0")) return `+380${digits.slice(1)}`;
  if (digits.length === 9) return `+380${digits}`;
  if (digits.length === 13 && digits.startsWith("380")) return `+${digits.slice(-12)}`;
  return `+${digits}`;
}


async function toJpegBlob(file) {
  if (!file || file.type === "image/jpeg") return file;
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");

  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}


async function validatePhoto(file) {
  if (!file) throw new Error("Upload a photo");
  if (!file.type.startsWith("image/")) throw new Error("Only images are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Max 5MB");

  const url = URL.createObjectURL(file);
  const { w, h } = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res({ w: i.width, h: i.height });
    i.onerror = () => rej(new Error("Bad image"));
    i.src = url;
  });
  if (w < 70 || h < 70) throw new Error("Min 70x70px");
}


const schema = Yup.object({
  name: Yup.string().trim().min(2).max(60).required("Required"),
  email: Yup.string().trim().email("Invalid email").required("Required"),
  phone: Yup.string()
    .required("Required")
    .transform((v) => normalizePhone(v))
    .matches(/^\+380\d{9}$/, "Format: +380XXXXXXXXX"),
  position_id: Yup.number().required("Select a position"),
  photo: Yup.mixed().required("Upload a photo"),
});

export default function PostForm({ onRegistered }) {
  const [positions, setPositions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    getPositions()
      .then((r) => {
        const byName = new Map(r.positions.map((p) => [p.name, p]));
        const ordered = DESIRED_POSITIONS.map((n) => byName.get(n)).filter(Boolean);
        setPositions(ordered);
      })
      .catch(() => setPositions([]));
  }, []);

  return (
    <section className="section" id="signup">
      <div className="container form-card">
        <h2>Working with POST request</h2>

        <Formik
          initialValues={{ name: "", email: "", phone: "", position_id: "", photo: null }}
          validationSchema={schema}
          onSubmit={async (values, { resetForm, setFieldError, setTouched }) => {
            setApiError("");
            setSubmitting(true);
            try {
              const phone = normalizePhone(values.phone);
              await validatePhoto(values.photo);
              const photoForUpload = await toJpegBlob(values.photo);

              const token = await getToken();
              const fd = new FormData();
              fd.append("name", values.name.trim());
              fd.append("email", values.email.trim());
              fd.append("phone", phone);
              fd.append("position_id", values.position_id);
              fd.append("photo", photoForUpload);

              const res = await createUser(fd, token);

              
              if (!res?.success) {
                const raw = String(res?.message || "");
                const msg = raw.toLowerCase();

                
                
                const emailDup = msg.includes("email");
                const phoneDup = msg.includes("phone");

                if (emailDup) setFieldError("email", "This email is already registered");
                if (phoneDup) setFieldError("phone", "This phone number is already registered");

                if (emailDup || phoneDup) {
                  
                  setTouched((t) => ({ ...t, email: true, phone: true }), true);
                } else {
                  
                  setApiError(raw || "Registration failed");
                }

                throw new Error(raw || "Registration failed");
              }

              
              resetForm();
              onRegistered?.(); 
            } catch (e) {
              if (!apiError) setApiError(e.message || "Error");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isValid, dirty, values, errors, touched, submitCount }) => (
            <Form className="reg-form">
              {}
              <label>
                <Field
                  name="name"
                  placeholder="Your name"
                  className={`text-input ${
                    errors.name && (touched.name || submitCount > 0) ? "is-error" : ""
                  }`}
                />
                <ErrorMessage name="name" component="span" className="err" />
              </label>

              {}
              <label>
                <Field
                  name="email"
                  placeholder="Email"
                  className={`text-input ${
                    errors.email && (touched.email || submitCount > 0) ? "is-error" : ""
                  }`}
                />
                <ErrorMessage name="email" component="span" className="err" />
              </label>

              {}
              <label>
                <Field
                  name="phone"
                  placeholder="+38 (XXX) XXX - XX - XX"
                  className={`text-input ${
                    errors.phone && (touched.phone || submitCount > 0) ? "is-error" : ""
                  }`}
                />
                <ErrorMessage name="phone" component="span" className="err" />
              </label>

              {}
              <fieldset
                className={`radios ${touched.position_id && errors.position_id ? "is-error" : ""}`}
              >
                <legend>Select your position</legend>
                {positions.map((p) => (
                  <label key={p.id} className="radio">
                    <Field type="radio" name="position_id" value={String(p.id)} />
                    {p.name}
                  </label>
                ))}
                <ErrorMessage name="position_id" component="span" className="err" />
              </fieldset>

              {}
              <div className={`upload ${touched.photo && errors.photo ? "is-error" : ""}`}>
                <label className="btn file-btn">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("photo", e.currentTarget.files?.[0] || null)}
                    hidden
                  />
                </label>
                <span className={`file-name ${values.photo ? "has" : ""}`}>
                  {values.photo ? values.photo.name : "Upload your photo"}
                </span>
              </div>
              <ErrorMessage name="photo" component="span" className="err" />

              {}
              {apiError && <div className="form-error">{apiError}</div>}

              <button type="submit" className="btn-yellow" disabled={submitting || !dirty || !isValid}>
                {submitting ? "Sending…" : "Sign up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
