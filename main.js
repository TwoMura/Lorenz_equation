let trajectoryData = {x: [], y: [], z: []};
let isPaused = false;

let current_camera = {
  eye: {x: 0.7, y: -0.5, z: 0.3},
  up: {x: -0.3, y: 0.2, z: 1.0}
};

delta_t = 0.001;

let x = Number(document.getElementById('x_0').value);
let y = Number(document.getElementById('y_0').value);
let z = Number(document.getElementById('z_0').value);

let sigma = Number(document.getElementById('sigma').value);
let rho = Number(document.getElementById('rho').value);
let beta = Number(document.getElementById('beta').value);
let frame_per_step = Number(document.getElementById('f_p_s').value);
let line_width = Number(document.getElementById('line_width').value);
let point_per_step = 10;
let frame_per_point = Math.floor(frame_per_step / point_per_step);


function updateParameters() {
  x = Number(document.getElementById('x_0').value);
  y = Number(document.getElementById('y_0').value);
  z = Number(document.getElementById('z_0').value);

  sigma = Number(document.getElementById('sigma').value);
  rho = Number(document.getElementById('rho').value);
  beta = Number(document.getElementById('beta').value);
  frame_per_step = Number(document.getElementById('f_p_s').value);
  line_width = Number(document.getElementById('line_width').value);
  frame_per_point = Math.floor(frame_per_step / point_per_step);

  trajectoryData = {x: [], y: [], z: []};
}



function updateWorld(x_n, y_n, z_n) {
  const x_np1 = x_n + delta_t * sigma * (y_n - x_n);
  const y_np1 = y_n + delta_t * (x_n * (rho - z_n) - y_n);
  const z_np1 = z_n + delta_t * (x_n * y_n - beta * z_n);
  return [x_np1, y_np1, z_np1];
}


function updateTrajectory() {
  if (!isPaused) {
    for (let i = 0; i < frame_per_point; i++) {
      trajectoryData.x.push(x);
      trajectoryData.y.push(y);
      trajectoryData.z.push(z);
      for (let j = 0; j < point_per_step; j++) {
        xyz = updateWorld(x, y, z);
        x = xyz[0];
        y = xyz[1];
        z = xyz[2];
      }
    }

    const trajectoryTrace = {
      x: trajectoryData.x,
      y: trajectoryData.y,
      z: trajectoryData.z,
      mode: 'lines',
      type: 'scatter3d',
      line: {
        width: line_width,
        color: 'blue',
      },
      name: 'orbit'
    };

    const currentPositionTrace = {
      x: [x],
      y: [y],
      z: [z],
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        size: 5,
        color: 'red',
      },
      name: 'current position'
    };

    const plot_area_scale = 300;
    const layout = {
      scene: {
        camera: current_camera,
        aspectmode: 'manual',
        aspectratio: {x: 1, y: 1, z: 1},
        xaxis: {
          title: 'X',
          range: [-plot_area_scale, plot_area_scale],
          tick0: 0,
          dtick: 50
        },
        yaxis: {
          title: 'Y',
          range: [-plot_area_scale, plot_area_scale],
          tick0: 0,
          dtick: 50
        },
        zaxis: {
          title: 'Z',
          range: [-plot_area_scale, plot_area_scale],
          tick0: 0,
          dtick: 50
        },
      },
      title: 'Lorenz equation curve',
    };

    Plotly.newPlot('myPlot', [trajectoryTrace, currentPositionTrace], layout);
  }

  requestAnimationFrame(updateTrajectory);
}

document.getElementById('pause_button').onclick = function() {
  isPaused = !isPaused;
  this.textContent = isPaused ? 'resume' : 'pause';
  if (!isPaused) {
    const plotElement = document.getElementById('myPlot');
    current_camera = plotElement._fullLayout.scene.camera;
    console.log(current_camera)
  }
};

const reload_event = document.getElementById('reload_button');
reload_event.addEventListener('click', updateParameters);

updateTrajectory();
