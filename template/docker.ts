import Dockerode from 'dockerode';
import fs from 'fs';
import dotenv from 'dotenv';
import yaml from 'js-yaml';
dotenv.config();

class Docker {

	// up container
	public async developUp(filePath: string, containerName: string) {
		const docker = new Dockerode();

		const containerOptions = {
			Image: 'postgres:12',
			WorkingDir: '/app',
			Env: ["POSTGRES_USER=yaseen",
				"POSTGRES_PASSWORD=password",
				"POSTGRES_DB=mydatabase"
			],
			ExposedPorts: {
				"5432/tcp": {}
			},
			name: 'test-postgres',
		};
		// @ts-ignore
		const container = await docker.createContainer(containerOptions);
		const containerId = container.id;

		container.start((err, data) => {
			if (err) {
				console.error(err);
			} else {
				console.log('Container created successfully');
			}
		});
		return containerId;
	}

	// stop container
	public async developDown(containerId: string) {
		const docker = new Dockerode();

		docker.getContainer(containerId).remove({ force: true }, (err, data) => {
			if (err) {
				// handle error
				console.log(err)
			} else {
				// container killed successfully
				return containerId;
			}
		});
	}

	// get config file data in json
	public async getDockerJson(filePath: string) {
		const yamlData = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.stringify(yaml.load(yamlData));

		return jsonData;
	}

	// get env data into json
	public async getEnv(filePath: string) {
		const envData = dotenv.parse(fs.readFileSync(filePath));
		return envData;
	}

	// get status of container by id
	public async getDockerStatus(containerId: string) {
		const docker = new Dockerode();

		try {
			const container = docker.getContainer(containerId);
			// @ts-ignore
			const containerInfo = await container.inspect();
			return containerInfo.State.Status;
		} catch (error) {
			console.error(error);
		}
	}

	// generate the config file
	public async generate(filePath) {
		const yamlData = fs.readFileSync(filePath, 'utf8');
	}

	// generate docker file
	public async generateDockerfile(containerId: string) {
		const docker = new Dockerode();
		const container = docker.getContainer(containerId);
		// @ts-ignore
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
}

export default Docker;