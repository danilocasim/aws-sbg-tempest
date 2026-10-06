import { club, members } from "@/lib/data";
export default function Export() {
  const rows = members.filter((m) => m.visibility !== "inactive");
  return (<>
    <div className="admin-head"><div><span className="eyebrow">For the card printer</span><h1>Card list export</h1></div><a className="btn btn-primary btn-sm" href={`data:text/csv;charset=utf-8,${encodeURIComponent(["displayName,canonicalId,url", ...rows.map((m) => `"${m.displayName}",${m.canonicalId},https://${club.domain}/p/${m.canonicalId}`)].join("\n"))}`} download="card-list.csv">Download CSV</a></div>
    <div className="table-wrap"><table className="table"><thead><tr><th>displayName</th><th>canonicalId</th><th>url</th></tr></thead><tbody>{rows.map((m) => <tr key={m.id}><td style={{ color: "var(--fg)" }}>{m.displayName}</td><td className="mono">{m.canonicalId}</td><td className="mono">https://{club.domain}/p/{m.canonicalId}</td></tr>)}</tbody></table></div>
    <p className="faint" style={{ marginTop: "1rem" }}>{rows.length} rows · encode each URL as an NDEF URI record · never re-encode a card after printing.</p>
  </>);
}
