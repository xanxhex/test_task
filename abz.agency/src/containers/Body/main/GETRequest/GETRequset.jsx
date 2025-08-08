
import React, { useEffect, useRef, useState } from "react";
import { getUsers } from "@/api/users";
import UserCard from "@/containers/Body/main/GETRequest/UserCard";
import "@/containers/Body/main/GETRequest/GETRequest.scss";

const PAGE_SIZE = 6;

export default function GETRequest({refetchFirstPageRef}) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadFirstPage = async () => {
    
    loadedPages.current = new Set();
    setUsers([]);
    setPage(0);
    await loadUsers(1);
  };
  
  const didInit = useRef(false);
  
  const loadedPages = useRef(new Set());

  const loadUsers = async (nextPage) => {
    if (loadedPages.current.has(nextPage)) return; 
    try {
      setLoading(true);
      setError(null);

      const res = await getUsers(nextPage, PAGE_SIZE); 
      loadedPages.current.add(nextPage);

      
      setUsers(prev => (nextPage === 1 ? res.users : [...prev, ...res.users]));
      setPage(res.page);
      setTotalPages(res.total_pages);
    } catch (err) {
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (refetchFirstPageRef) {
      refetchFirstPageRef.current = loadFirstPage;
    }
  }, [refetchFirstPageRef]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    loadUsers(1); 
  }, []);

  const isLastPage = totalPages !== null && page >= totalPages;

  return (
    <section className="section" id="users">
      <div className="container">
        <h2>Working with GET request</h2>

        {error && <div className="users__error">{error}</div>}

        <div className="users-grid">
          {users.map(u => <UserCard key={u.id} user={u} />)}
        </div>

        {!isLastPage && (
          <div className="users__actions">
            <button
              className={`btn-yellow ${isLastPage ? "disabled" : ""}`}
              onClick={() => !isLastPage && loadUsers(page + 1)}
              disabled={loading || isLastPage}
            >
              {isLastPage ? "Show more" : loading ? "Loading…" : "Show more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
