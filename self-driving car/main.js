const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);
const car=new Car(road.getLaneCenter(1),100,25,47, "AI"); //our car
const traffic = [
    new Car(road.getLaneCenter(1), -100,25,47, "DUMMY", 2.7) //simple behaviour
];

animate();

function animate(){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.7);

    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "purple");
    }
    road.draw(carCtx);
    car.draw(carCtx, "blue");

    carCtx.restore();
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}