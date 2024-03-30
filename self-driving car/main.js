const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9);
const car=new Car(road.getLaneCenter(1),100,25,47, "KEYS"); //our car
const traffic = [
    new Car(road.getLaneCenter(1), -100,25,47, "DUMMY", 2.7) //simple behaviour
];

animate();

function animate(){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);

    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7);

    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(ctx, "purple");
    }
    road.draw(ctx);
    car.draw(ctx, "blue");

    ctx.restore();
    requestAnimationFrame(animate);
}