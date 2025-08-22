import { useEffect } from "react";
import { saveHistory } from "../utils/HistoryStorage";
import { useOutletContext } from "react-router";

const Log = () => {
  const { history } = useOutletContext();

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  return (
    <>
      {history.length === 0 ? (
        <p className="mt-4 font-bold">No History</p>
      ) : (
        <div>
          {history.map((item) => (
            <div className="mt-4" key={item.id}>
              <div className="flex justify-center">
                <img
                  src={item.image}
                  className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow"
                  style={{ width: "100%", borderRadius: 6 }}
                />
              </div>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                {item.result?.english && (
                  <div>
                    <b>EN:</b> {item.result.english}
                  </div>
                )}
                {item.result?.korean && (
                  <div>
                    <b>KO:</b> {item.result.korean}
                    {item.result.romanized ? ` (${item.result.romanized})` : ""}
                  </div>
                )}
                {item.result?.thai && (
                  <div>
                    <b>TH:</b> {item.result.thai}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Log;
