export const exportBackup = () => {
  const data = {};

  Object.keys(localStorage).forEach((key) => {
    data[key] = localStorage.getItem(key);
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "gym-backup.json";

  a.click();

  window.URL.revokeObjectURL(url);
};

export const importBackup = (file, onSuccess) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, data[key]);
      });

      alert("Backup Imported ✅");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert("Invalid Backup File ❌");
    }
  };

  reader.readAsText(file);
};
