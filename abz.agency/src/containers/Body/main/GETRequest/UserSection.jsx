import React, { useEffect, useState } from "react";
import { getUsers } from "@/api/users";
import UserCard from "./UserCard";
import "./UsersSection.scss";

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function load(nextPage) {
    try {
      setLoading(true);
      setErr(null);
      const res = await getUsers(nextPage, 6);
      setUsers(prev => [...prev, ...res.users]);
      setPage(res.page);
      setTotalPages(res.total_pages);
    } catch (e) {
      setErr(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1); }, []);

  const isLastPage = totalPages !== null && page >= totalPages;

  return (
    <section className="users_section">
      <div className="container">
        <h2 className="heading">Working with GET request</h2>

        {err && <div role="alert" className="users__error">{err}</div>}

        <div className="users-grid">
          {users.map(u => <UserCard key={u.id} user={u} />)}
        </div>

        {!isLastPage && (
          <div className="users__actions">
            <button className="btn-yellow" onClick={() => load(page + 1)} disabled={loading}>
              {loading ? "Loading…" : "Show more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}