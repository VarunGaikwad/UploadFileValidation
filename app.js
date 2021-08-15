let extJSON;
$.ajax({
    url: "fileSign.json",
    type: "get",
    async: false,
    success: function (sResponse) {
        extJSON = sResponse;
    },
    error: function (eResponse) {
    }
});
const validateFileExtension = (oFile) => {
    return new Promise((resolve, reject) => {
        var oReader = new FileReader();
        oReader.zFileExt = oFile.name.split(".").pop().toLowerCase();
        oReader.readAsArrayBuffer(oFile);
        oReader.addEventListener("load", function () {
            var sHex = Array(...new Uint8Array(this.result)).map(function (x) {
                return ("00" + x.toString(16)).slice(-2);
            }).join("").toUpperCase(),
                aSigns = this.zFileExt in extJSON ? extJSON[this.zFileExt].signs[0].split(",") : []
            if (!aSigns.length) {
                bFlag = false;
            } else {
                for (var sSign of aSigns) {
                    bFlag = sHex.includes(sSign);
                    if (!bFlag) {
                        break;
                    }
                }
            }
            resolve(bFlag);
        });
        oReader.addEventListener("error", function () {
            reject(error);
        });
    });
}
const onFileUpload = async () => {
    if (!await validateFileExtension(event.target.files[0])) {
        document.querySelector("input[type='file']").value = "";
    }
}