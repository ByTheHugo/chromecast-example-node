var express               = require('express');
var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var { spawn }             = require('child_process');
var path                  = require('path');
var fs                    = require('fs');
var client = new Client();
var server = express();

// ====================================================================
// VARIABLES A REDEFINIR EN FONCTION DE VOTRE ENVIRONNEMENT
// ====================================================================
var APP_PORT      = 2727;
var HOST_IP       = "";
var CHROMECAST_IP = "";
var PICO2WAVE_BIN = "/usr/bin/pico2wave";
var PUBLIC_PATH   = "";
var TEXT_TO_SAY   = "Hello world !";
// ====================================================================

// On configure le serveur web permettant de distribuer les fichiers audios générés
server.set("port", APP_PORT);
server.use("/public", express.static(PUBLIC_PATH));
server.listen(APP_PORT);

// On génère le fichier audio à partir du texte configuré
var filename = Date.now() + ".wav";
var pico_ps = spawn(PICO2WAVE_BIN, ["-l", "fr-FR", "-w", path.join(PUBLIC_PATH, filename), TEXT_TO_SAY]);

pico_ps.on("close", (code) => {
  console.log("child process exited with code %i", code);

  // On se connecte à la Chromecast et on joue le fichier généré
  client.connect(CHROMECAST_IP, function () {
    console.log('connected, launching app ...');

    client.launch(DefaultMediaReceiver, function (err, player) {
      if (err) {
        console.log("can't launch app because %s", err.message);
        client.close();
        process.exit(1);
      }

      var media = {
        contentId: "http://" + HOST_IP + ":" + APP_PORT + "/public/" + filename,
        contentType: "audio/wav",
        streamType: "BUFFERED",
        metadata: {
          type: 0,
          metadataType: 3,
          title: TEXT_TO_SAY,
          artist: "NodeJS"
        }
      };
      var loaded = false;

      console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);

      player.load(media, { autoplay: true }, function (err, status) {
        if (err) {
          console.log("can't play media because %s", err.message);
          player.close();
          client.close();
          process.exit(1);
        }
        console.log('media loaded playerState=%s', status.playerState);
        loaded = true;
      });

      player.on('status', function (status) {
        console.log('status broadcast playerState=%s', status.playerState);

        if (loaded && status.playerState == "IDLE") {
          // On supprime le fichier généré
          fs.unlink(path.join(PUBLIC_PATH, filename), function (err) {
            if (err) console.log("can't remove file %s because %s", filename, err.message);
            player.close();
            client.close();
            process.exit(0);
          });
        }
      });

    });
  });

  client.on('error', function (err) {
    console.log('Error: %s', err.message);
    client.close();
    process.exit(1);
  });

});

pico_ps.stdout.on("data", (data) => {
  console.log("stdout: %s", data);
});

pico_ps.stderr.on("data", (data) => {
  console.log("stderr: %s", data);
});
