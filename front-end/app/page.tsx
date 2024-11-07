'use client'
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { DoorClosed, DoorOpen, Thermometer, Droplets, Lightbulb, Wind, Tv, Refrigerator, WashingMachine } from 'lucide-react';

// Define an interface for the data you're fetching
interface SensorData {
  temperature: number;
  humidity: number;
}

export default function ElegantSmartHomeDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [doorLocked, setDoorLocked] = useState(true);
  const [lightsOn, setLightsOn] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(0);
  const [tvOn, setTvOn] = useState(false);
  const [fridgeTemp] = useState(4);
  const [washerOn, setWasherOn] = useState(false);

  // Use the defined interface for data state
  const [data, setData] = useState<SensorData>({ temperature: 0, humidity: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://server-smarthome.vercel.app/api/data/dht');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: SensorData = await response.json();
        setData(result);
      } catch (err: unknown) {
        console.log(err);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleToggle = async (action: string) => {
    try {
      const response = await fetch('https://server-smarthome.vercel.app/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: action }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleLights = () => {
    setLightsOn((prev) => {
      const newState = !prev;
      handleToggle(newState ? 'on led bar' : 'off led bar');
      return newState;
    });
  };

  const toggleDoorLock = () => {
    setDoorLocked((prev) => {
      const newState = !prev;
      handleToggle(newState ? 'open window' : 'close window');
      return newState;
    });
  };

  const toggleTV = () => {
    setTvOn((prev) => {
      const newState = !prev;
      handleToggle(newState ? 'relay on' : 'relay off');
      return newState;
    });
  };

  const toggleWasher = () => {
    setWasherOn((prev) => {
      const newState = !prev;
      handleToggle(newState ? 'start washer' : 'stop washer');
      return newState;
    });
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white text-left">Smart Home</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-300">Light</span>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              aria-label="Toggle dark mode"
            />
            <span className="text-gray-800 dark:text-white">Dark</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Smart Door Lock */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Smart Lock
                <Switch
                  checked={doorLocked}
                  onCheckedChange={toggleDoorLock}
                  aria-label="Toggle door lock"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {doorLocked ? (
                <DoorClosed className="w-16 h-16 text-green-500 mx-auto" />
              ) : (
                <DoorOpen className="w-16 h-16 text-red-500 mx-auto" />
              )}
            </CardContent>
            <CardFooter className="text-center">
              {doorLocked ? "Door is locked" : "Door is unlocked"}
            </CardFooter>
          </Card>

          {/* Temperature Control */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <Thermometer className="w-8 h-8 text-orange-500 mr-2" />
                <span className="text-4xl font-bold">{data.temperature}°C</span>
              </div>
            </CardContent>
          </Card>

          {/* Humidity Display */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Humidity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <Droplets className="w-8 h-8 text-blue-500 mr-2" />
                <span className="text-4xl font-bold">{data.humidity}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Lighting Control */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Lighting
                <Switch
                  checked={lightsOn}
                  onCheckedChange={toggleLights}
                  aria-label="Toggle lights"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Lightbulb className={`w-16 h-16 mx-auto ${lightsOn ? 'text-yellow-400' : 'text-gray-600'}`} />
            </CardContent>
            <CardFooter className="text-center">
              {lightsOn ? "Lights are on" : "Lights are off"}
            </CardFooter>
          </Card>

          {/* Fan Control */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Fan Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <Wind className={`w-8 h-8 mr-2 ${fanSpeed > 0 ? 'text-blue-500' : 'text-gray-600'}`} />
                <span className="text-4xl font-bold">{fanSpeed}%</span>
              </div>
              <Slider
                value={[fanSpeed]}
                onValueChange={(value: number[]) => setFanSpeed(value[0])}
                max={100}
                step={1}
                aria-label="Set fan speed"
              />
            </CardContent>
          </Card>

          {/* TV Control */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                TV
                <Switch
                  checked={tvOn}
                  onCheckedChange={toggleTV}
                  aria-label="Toggle TV"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tv className={`w-16 h-16 mx-auto ${tvOn ? 'text-purple-500' : 'text-gray-600'}`} />
            </CardContent>
            <CardFooter className="text-center">
              {tvOn ? "TV is on" : "TV is off"}
            </CardFooter>
          </Card>

          {/* Refrigerator Control */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Fridge Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <Refrigerator className="w-8 h-8 text-blue-500 mr-2" />
                <span className="text-4xl font-bold">{fridgeTemp}°C</span>
              </div>
            </CardContent>
          </Card>

          {/* Washer Control */}
          <Card className="bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Washer
                <Switch
                  checked={washerOn}
                  onCheckedChange={toggleWasher}
                  aria-label="Toggle washer"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WashingMachine className={`w-16 h-16 mx-auto ${washerOn ? 'text-green-500' : 'text-gray-600'}`} />
            </CardContent>
            <CardFooter className="text-center">
              {washerOn ? "Washer is running" : "Washer is off"}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
