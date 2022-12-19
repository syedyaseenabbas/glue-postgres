const Dockerode = require('dockerode');
const fs = require('fs');
const dotenv = require('dotenv');
const yaml = require('js-yaml');
const dockerConfig = require('./dockerode-env.json')

const generateDockerfile = async (containerId) => {
	const docker = new Dockerode();
	const container = docker.getContainer(containerId);
	const info = await container.inspect();

	// Create the Dockerfile
	let dockerfile = `
FROM ${info.Config.Image}

`;

	// Add the container's environment variables to the Dockerfile
	if (info.Config.Env) {
		dockerfile += `ENV ${info.Config.Env.join('\nENV ')}\n\n`;
	}

	// Add the container's exposed ports to the Dockerfile
	if (info.Config.ExposedPorts) {
		const exposedPorts = Object.keys(info.Config.ExposedPorts);
		dockerfile += `EXPOSE ${exposedPorts.join(' ')}\n`;
	}

	// Add the container's entrypoint to the Dockerfile
	if (info.Config.Entrypoint) {
		dockerfile += `ENTRYPOINT ${info.Config.Entrypoint}\n`;
	}

	// Add the container's command to the Dockerfile
	if (info.Config.Cmd) {
		dockerfile += `CMD ${info.Config.Cmd}\n`;
	}

	// Write the Dockerfile to a file
	fs.writeFileSync('Dockerfile', dockerfile);
}

const developUp = async (filePath, containerName) => {
	const docker = new Dockerode();
	const dockerodeEnv = Object.keys(dockerConfig.Env).map(key => {
		// if environment value is an object convert into string
		return `${key}=${typeof dockerConfig.Env[key] === 'object'
			? JSON.stringify(dockerConfig.Env[key])
			: dockerConfig.Env[key]
			}`
	})
	console.log(dockerodeEnv)
	const containerOptions = {
		Image: dockerConfig.Image,
		WorkingDir: dockerConfig.WorkingDir,
		Env: dockerodeEnv,
		HostConfig: {
			PortBindings: {
				[dockerConfig.ContainerPort]: [
					{
						"HostPort": dockerConfig.HostPort
					}
				]
			}
		},
		ExposedPorts: {
			[dockerConfig.ExposedPorts]: {}
		},
		name: dockerConfig.name,
	};

	const container = await docker.createContainer(containerOptions);
	const containerId = container.id;

	container.start((err, data) => {
		if (err) {
			console.error(err);
		} else {
			console.log('Container start successfully');
		}
	});
	return containerId;

}

const developDown = async (containerId) => {
	const docker = new Dockerode();

	docker.getContainer(containerId).remove({ force: true }, (err, data) => {
		if (err) {
			// handle error

		} else {
			// container killed successfully
			return containerId;
		}
	});


}

const getDockerJson = async (filePath) => {
	const yamlData = fs.readFileSync(filePath, 'utf8');
	const jsonData = JSON.parse(JSON.stringify(yaml.load(yamlData)));
	console.log(jsonData.services.postgres.image)
	return jsonData;

}

const getEnv = async (filePath) => {
	dotenv.config();

	const envData = dotenv.parse(fs.readFileSync(filePath));
	return envData;
}

const getDockerStatus = async (containerId) => {
	const docker = new Dockerode();

	try {
		const container = docker.getContainer(containerId);
		const containerInfo = await container.inspect();
		return containerInfo.State.Status;
	} catch (error) {
		console.error(error);
	}
}

const dockerNode = async () => {
	const containerId = await developUp();
	console.log("ContainerId =", containerId);

	// setTimeout(async () => {
	// 	await generateDockerfile(containerId)
	// }, 3000)

	const status = await getDockerStatus(containerId)
	console.log(status)

}

dockerNode();