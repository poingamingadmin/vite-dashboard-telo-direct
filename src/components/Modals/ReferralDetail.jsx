import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";
import AxiosInstance from "../Api/AxiosInstance";

const ReferralDetail = forwardRef(({ selectedReferral, setListData, setShowModalDetail }, ref) => {
    if (!selectedReferral) {
        return <p>No referral selected</p>;
    }

    const [ndpType, setNdpType] = useState("idr");
    const [rdpType, setRdpType] = useState("idr");
    const [ndpValue, setNdpValue] = useState("");
    const [rdpValue, setRdpValue] = useState("");
    const [status, setStatus] = useState("verify");
    const [isSaving, setIsSaving] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const isVerify = status === "verify";

    useEffect(() => {
        if (selectedReferral) {
            setNdpType(selectedReferral.commission_ndp_type || "idr");
            setRdpType(selectedReferral.commission_rdp_type || "idr");
            setStatus(selectedReferral.status || "verify");

            setNdpValue(
                selectedReferral.commission_ndp_value !== null && selectedReferral.commission_ndp_value !== undefined
                    ? selectedReferral.commission_ndp_value
                    : ""
            );
            setRdpValue(
                selectedReferral.commission_rdp_value !== null && selectedReferral.commission_rdp_value !== undefined
                    ? selectedReferral.commission_rdp_value
                    : ""
            );
        }
    }, [selectedReferral]);

    const renderTypeNote = (type) => (
        <small className="text-muted">
            {type === "percent"
                ? "Persentase dari total deposit"
                : "Jumlah tetap dalam Rupiah (IDR)"}
        </small>
    );

    useImperativeHandle(ref, () => ({
        async handleSave() {
            setIsSaving(true);
            try {
                const payload = {
                    commission_ndp_type: ndpType,
                    commission_ndp_value: ndpValue,
                    commission_rdp_type: rdpType,
                    commission_rdp_value: rdpValue,
                    status: status,
                };

                console.log("Payload yang dikirim:", payload);

                const res = await AxiosInstance.put(`/referral/${selectedReferral.referral_id}`, payload);

                if (res.data.success) {
                    setListData(prev =>
                        prev.map(item =>
                            item.referral_id === selectedReferral.referral_id
                                ? {
                                    ...item,
                                    status: res.data.data.status,
                                    commission_ndp_type: res.data.data.commission_ndp_type,
                                    commission_ndp_value: res.data.data.commission_ndp_value,
                                    commission_rdp_type: res.data.data.commission_rdp_type,
                                    commission_rdp_value: res.data.data.commission_rdp_value
                                }
                                : item
                        )
                    );
                    setShowModalDetail(false);
                }
            } catch (err) {
                console.error("Save failed:", err);
            } finally {
                setIsSaving(false);
            }
        }
    }));

    return (
        <div className="container">
            <Modal centered show={showImageModal} onHide={() => setShowImageModal(false)}>
                <Modal.Body className="text-center p-0">
                    <img
                        src={`data:image/png;base64,${selectedReferral?.id_card || ""}`}
                        alt="ID Card Full"
                        className="img-fluid"
                        style={{ maxHeight: "90vh", objectFit: "contain" }}
                    />
                </Modal.Body>
            </Modal>

            <div className="row align-items-start g-3">
                <div className="col-md-4 text-center">
                    <img
                        src={`data:image/png;base64,${selectedReferral?.id_card || ""}`}
                        alt="ID Card"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "240px", objectFit: "cover", cursor: "zoom-in" }}
                        onClick={() => setShowImageModal(true)}
                    />
                    <small className="text-muted d-block mt-2">Klik untuk perbesar gambar</small>
                </div>

                <div className="col-md-8">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control form-control-sm" value={selectedReferral?.username || ""} disabled />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Total User</label>
                            <input type="text" className="form-control form-control-sm" value={selectedReferral?.referred_users_count?.toLocaleString("id-ID") || "0"} disabled />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Referral Code</label>
                            <input type="text" className="form-control form-control-sm" value={selectedReferral?.referral_code || "-"} disabled />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Referral Balance</label>
                            <input type="text" className="form-control form-control-sm" value={Number(selectedReferral?.referral_balance || 0).toLocaleString("id-ID")} disabled />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4 g-3">
                <div className="col-md-6">
                    <label className="form-label">Approved At</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={
                            selectedReferral?.approved_at
                                ? `${new Date(selectedReferral.approved_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })} | ${new Date(selectedReferral.approved_at).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                })}`
                                : "-"
                        }
                        disabled
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                        className={`form-select form-select-sm fw-semibold ${status === "active"
                            ? "text-success"
                            : status === "suspended"
                                ? "text-danger"
                                : "text-warning"
                            }`}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={status === "verify"}
                    >
                        <option value="active">ACTIVE</option>
                        <option value="suspended">SUSPENDED</option>
                    </select>
                </div>
            </div>

            {isVerify && (
                <div className="alert alert-warning fw-semibold text-center mt-3">
                    Silakan <strong>Approve</strong> atau <strong>Reject</strong> terlebih dahulu untuk mengedit data komisi.
                </div>
            )}

            <div className="row mt-2 g-3">
                <div className="col-md-6">
                    <label className="form-label">NDP Commission</label>
                    <div className="input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control"
                            value={ndpValue}
                            onChange={(e) => setNdpValue(e.target.value)}
                            disabled={isVerify}
                        />
                        <select
                            className="form-select"
                            value={ndpType}
                            onChange={(e) => setNdpType(e.target.value)}
                            disabled={isVerify}
                        >
                            <option value="idr">IDR</option>
                            <option value="percent">Percent</option>
                        </select>
                    </div>
                    {renderTypeNote(ndpType)}
                </div>

                <div className="col-md-6">
                    <label className="form-label">RDP Commission</label>
                    <div className="input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control"
                            value={rdpValue}
                            onChange={(e) => setRdpValue(e.target.value)}
                            disabled={isVerify}
                        />
                        <select
                            className="form-select"
                            value={rdpType}
                            onChange={(e) => setRdpType(e.target.value)}
                            disabled={isVerify}
                        >
                            <option value="idr">IDR</option>
                            <option value="percent">Percent</option>
                        </select>
                    </div>
                    {renderTypeNote(rdpType)}
                </div>
            </div>
        </div>
    );
});

export default ReferralDetail;
