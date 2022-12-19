const Dockerode = require('dockerode');

const pullImage = async (imageName) => {
	const docker = new Dockerode();
	new Promise(async (resolve, reject) => {
		await docker.pull(imageName, (err, stream) => {
			if (err) {
				return reject;
			}
			docker.modem.followProgress(stream, (err, output) => {
				if (err) {
					return reject;
				}
				console.log(output);
				return resolve;
			});
		});
	});
}

module.exports = pullImage;