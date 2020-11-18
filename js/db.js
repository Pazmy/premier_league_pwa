let dbPromised = idb.open("football", 2, function (upgradeDb) {
  let teamObjectStore = upgradeDb.createObjectStore("teams", { keyPath: "id" });
  teamObjectStore.createIndex("name", "name", { unique: false });
});

function saveTeam(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      store.put(team);
      return tx.complete;
    })
    .then(function () {
      M.toast({ html: "Data berhasil disimpan", classes: "green accent-4" });
      document.getElementById("elem").remove();
      console.log("berhasil menyimpan");
    })
    .catch(() => M.toast({ html: "Operasi gagal" }));
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}
function deleteTeam(id) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");

      store.delete(id);
      return tx.complete;
    })
    .then(function (team) {
      M.toast({ html: "Item berhasil dihapus", classes: "red darken-1" });
      location.reload();
    });
}
