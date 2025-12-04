import Link from "next/link";

export default function Custom404(props) {
    return (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <h1>404 - Seite nicht gefunden</h1>
            <p>Bitte überprüfe die URL oder gehe zurück zur Startseite.</p>
            <Link
                href="/"
                style={{ color: "#0070f3", textDecoration: "underline" }}
            />
        </div>
    );
}