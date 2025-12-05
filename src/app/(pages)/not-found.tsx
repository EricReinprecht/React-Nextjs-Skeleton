import Link from "next/link";

const Custom404Page = () => {
    return (
        <div>
            <h1>404 - Seite nicht gefunden</h1>
            <p>Bitte überprüfe die URL oder gehe zurück zur Startseite.</p>
            <Link
                href="/"
                style={{ color: "#0070f3", textDecoration: "underline" }}
            />
        </div>
    );
}

export default Custom404Page;