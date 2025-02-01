trait Shape {
    fn area(&self) -> f32;
}

struct Circle(f32, f32, f32);

impl Shape for Circle {
    fn area(&self) -> f32 {
        std::f32::consts::PI * self.2 * self.2
    }
}

struct Square(f32);

impl Shape for Square {
    fn area(&self) -> f32 {
        self.0 * self.0
    }
}

fn total_area(v: &Vec<Box<dyn Shape>>) -> f32 {
    let mut total = 0.0;

    for x in v {
        total += x.area();
    }
    total
}

fn main() {
    let v: Vec<Box<dyn Shape>> = 
        vec![Box::new(Circle(0.0, 0.0, 1.0)), Box::new(Square(2.0))];

    println!("{}", total_area(&v));
}
