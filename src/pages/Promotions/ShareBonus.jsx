import { useState } from "react";
import Papa from "papaparse";
import Breadcrumb from "../../components/Layouts/Breadcrumb";
import { Button, Card, Table, Spinner } from "react-bootstrap";
import AxiosInstance from "../../components/Api/AxiosInstance";
import { saveAs } from "file-saver";

const ShareBonus = () => {
  const [csvData, setCsvData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingCount, setProcessingCount] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const dataWithStatus = result.data.map((row) => ({
            ...row,
            status: "",
            isProcessing: false,
          }));
          setCsvData(dataWithStatus);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  const handleConfirmShareBonus = async () => {
    setIsProcessing(true);
    const updatedData = [...csvData];

    const promises = updatedData.map(async (row, index) => {
      updatedData[index].isProcessing = true;
      setCsvData(updatedData);

      try {
        const response = await AxiosInstance.post("/promotions/share-bonus", {
          data: [row],
        });

        if (response.data.success) {
          updatedData[index].status = "Success";
        } else {
          updatedData[index].status = "Failed";
        }
      } catch (error) {
        console.error("Error while sending data:", error);
        updatedData[index].status = "Failed";
      }

      updatedData[index].isProcessing = false;
      setProcessingCount(processingCount + 1); 
      setCsvData(updatedData);
    });

    await Promise.all(promises);

    setIsProcessing(false);
  };

  const handleExportExample = () => {
    const exampleData = [
      {
        player_token: "12345",
        bonus_amount: "100",
        description: "Bonus for level up",
      },
      {
        player_token: "67890",
        bonus_amount: "200",
        description: "Bonus for completion",
      },
      {
        player_token: "54321",
        bonus_amount: "150",
        description: "Bonus for achievement",
      },
    ];

    const header = ["player_token", "bonus_amount", "description"];
    const rows = exampleData.map((item) => [
      item.player_token,
      item.bonus_amount,
      item.description,
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, "example-csv-share-bonus.csv");
  };

  return (
    <>
      <Breadcrumb title="Share Bonus" />
      <Card className="rounded-0 shadow-sm">
        <Card.Header className="d-flex justify-content-end align-items-center">
          <input
            className="form-control w-auto mb-2 mb-md-0 me-2"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />

          {csvData.length > 0 && (
            <>
              <Button
                className="rounded-2 mb-2 mb-md-0 me-2"
                variant="danger"
                onClick={handleConfirmShareBonus}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    Processing{" "}
                    <Spinner animation="border" size="sm" role="status" />
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
              <Button
                className="rounded-2 mb-2 mb-md-0 me-2"
                variant="outline-danger"
                onClick={() => setCsvData([])}
              >
                Hapus Data CSV
              </Button>
            </>
          )}

          <Button
            className="rounded-2 mb-2 mb-md-0"
            onClick={handleExportExample}
          >
            Example CSV
          </Button>
        </Card.Header>

        <Card.Body>
          {csvData.length > 0 && (
            <Table
              responsive
              hover
              size="sm"
              style={{ width: "100%" }}
              className="text-nowrap align-middle"
            >
              <thead className="bg-dark">
                <tr>
                  <th className="text-center">No.</th>
                  {Object.keys(csvData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th className="text-center">Status</th>
                  <th className="text-center">Processing</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>{value}</td>
                    ))}
                    <td className="text-center">
                      <span
                        className={`badge ${
                          row.status === "Success"
                            ? "bg-success"
                            : row.status === "Failed"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {row.status || "Pending"}
                      </span>
                    </td>
                    <td className="text-center">
                      {row.isProcessing ? (
                        <Spinner animation="border" size="sm" role="status" />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ShareBonus;
