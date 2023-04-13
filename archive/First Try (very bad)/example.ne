class Main {
    private int num = 0;

    private void Main() {
        Log("Hello, World!");
        Loop();
    }

    private void Loop() {
        Log($num)
        num++;
        Loop();
    }
}

out: {
    "classes": {
        "Main": {
            "attributes": {
                "#int:num": "0",
                "#void:Main": [
                    {"Run": "Base.Log", "Args": [{"Type": "string", "Val": "Hello, World!"}]}, 
                    {"Run": "Main.Loop", "Args": []}
                ], 
                "#void:Loop": [
                    {"Run": "Base.Log", "Args": [{"Type": "var", "Val": "#int:num"}]}, 
                    {"Run": "Math.Add", "Args": [{"Type": "var", "Val": "#int:num"}, {"Type": "int", "Value": 1}]}, 
                    {"Run": "Main.Loop", "Args": []}
                ]
            }
        }
    }
}

/* 
_____________________ OUTPUT _______________________
[OUT] > Hello, World
[OUT] > 0
[OUT] > 1
[OUT] > 2
[OUT] > 3
[OUT] > 4
[OUT] > 5
[OUT] > 6
[OUT] > 7
[OUT] > 8
[OUT] > 9
[OUT] > 10
[OUT] > 11
[OUT] > 12
[OUT] > 13
[OUT] > 14
[OUT] > 15
[OUT] > 16
[OUT] > 17
[OUT] > 18
[OUT] > 19
[OUT] > 20
[OUT] > 21
[OUT] > 22
[OUT] > 23
[OUT] > 24
[OUT] > 25
[OUT] > 26
[OUT] > 27
[OUT] > 28
[OUT] > 29
[OUT] > 30
[OUT] > 31
[OUT] > 32
[OUT] > 33
[OUT] > 34
[OUT] > 35
[OUT] > 36
[OUT] > 37
[OUT] > 38
[OUT] > 39
[OUT] > 40
[OUT] > 41
[OUT] > 42
[OUT] > 43
[OUT] > 44
[OUT] > 45
[OUT] > 46
[OUT] > 47
[OUT] > 48
[OUT] > 49
...
*/