"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // =========================
  // LOMAKKEEN TILA
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // KIRJAUTUMINEN
  // =========================

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Syötä sähköposti ja salasana.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error("Kirjautuminen epäonnistui:", error);

      setErrorMessage(
        "Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.",
      );

      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  // =========================
  // KÄYTTÖLIITTYMÄ
  // =========================

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Kirjautumiskortin leveys */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <div
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          {/* =========================
              OTSIKKO
          ========================= */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "700",
                margin: 0,
              }}
            >
              House Data Oy
            </h1>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#a1a1aa",
                fontSize: "14px",
              }}
            >
              Taloyhtiön hallintajärjestelmä
            </p>
          </div>

          {/* =========================
              SÄHKÖPOSTI
          ========================= */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#a1a1aa",
                fontSize: "14px",
              }}
            >
              Sähköposti
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nimi@email.fi"
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#27272a",
                color: "#ffffff",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
                padding: "14px 16px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          {/* =========================
              SALASANA
          ========================= */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#a1a1aa",
                fontSize: "14px",
              }}
            >
              Salasana
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#27272a",
                color: "#ffffff",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
                padding: "14px 16px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          {/* =========================
              VIRHEILMOITUS
          ========================= */}

          {errorMessage && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #991b1b",
                backgroundColor: "rgba(69, 10, 10, 0.3)",
                color: "#fca5a5",
                fontSize: "14px",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* =========================
              KIRJAUTUMISPAINIKE
          ========================= */}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "14px 20px",
              backgroundColor: "#ffffff",
              color: "#000000",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </div>

        {/* Alateksti */}
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#52525b",
            fontSize: "12px",
          }}
        >
          House Data Oy
        </p>
      </div>
    </main>
  );
}
