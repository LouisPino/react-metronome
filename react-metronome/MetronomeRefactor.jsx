import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Audio } from 'expo-av';


export default function MetronomeRefactor() {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const [tempo, setTempo] = useState(120)
    const [running, setRunning] = useState(false)
    const [timeSinceTap, setTimeSinceTap] = useState(0);
    const [tapTime, setTapTime] = useState(0);
    const [tapCount, setTapCount] = useState(0);
    const [tapTimeTotal, setTapTimeTotal] = useState(0);
    const [likelihood, setLikelihood] = useState(100);
    const [random, setRandom] = useState(false);
    const [beats, setBeats] = useState(1);
    const [divisor, setDivisor] = useState(2);
    const [secondaryRunning, setSecondaryRunning] = useState(false);
    const [subs, setSubs] = useState(0);
    const [ternaryRunning, setTernaryRunning] = useState(false);
    const [polyTop, setPolyTop] = useState(2);
    const [polyBottom, setPolyBottom] = useState(2);
    const metLoop = useRef()
    const secondaryMetLoop = useRef()
    const ternaryMetLoop = useRef()

    function promisedSetState(setter, newState) {
        return new Promise((resolve) => setter(newState));
    }


    function reset() {
        if (running) {
            clearInterval(metLoop.current);
            clearInterval(secondaryMetLoop.current);
            clearInterval(ternaryMetLoop.current);
            // ballEl.style.animation = "none";
            playMet();
        }
    }

    function stop() {
        setRunning(false)
        clearInterval(metLoop.current);
        clearInterval(secondaryMetLoop.current);
        clearInterval(ternaryMetLoop.current);
        // ballEl.style.animation = "none";
    };




    const [sound, setSound] = useState(null)
    const [sound2, setSound3] = useState(null)
    const [sound3, setSound2] = useState(null)

    async function playSound1() {
        const { sound } = await Audio.Sound.createAsync(require('./assets/clave.wav')
        );
        setSound(sound);
        await sound.playAsync();
    }
    async function playSound2() {
        const { sound2 } = await Audio.Sound.createAsync(require('./assets/clave2.wav')
        );
        setSound(sound2);
        await sound2.playAsync();
    }
    async function playSound3() {
        const { sound3 } = await Audio.Sound.createAsync(require('./assets/clave3.wav')
        );
        setSound(sound3);
        await sound3.playAsync();
    }

    async function oneClick(random, like, beatCount) {
        if (beatCount === 0) {
            if (random) {
                if (Math.random() < like / 100) {
                    playSound1()
                }
            } else {
                playSound1()
            }
        } else {
            if (random) {
                if (Math.random() < like / 100) {
                    playSound2()
                }
            } else {
                playSound2()
            }
        }
    }

    function playMet() {
        if (!tempo) {
            return;
        }
        setRunning(true);
        let like = likelihood;
        let tempoMs = 60000 / tempo;
        let beatCount = 0;
        let polyCount = 0;
        setTimeout(() => {
            // ballEl.style.animation = `slide ${tempoMs * 2}ms ease-out infinite`;
        }, tempoMs)
        metLoop.current = setInterval(function () {
            if (polyCount === 0) {
                clearInterval(ternaryMetLoop.current);
                playTernary();
            }
            polyCount++;
            clearInterval(secondaryMetLoop.current);
            oneClick(random, like, beatCount)
            playSecondary();
            if (beats === beatCount + 1) {
                beatCount = 0;
            } else {
                beatCount++;
            }
        }, tempoMs);
    };


    const tempoChange = async (newTemp) => {
        if (newTemp !== 0) {
            setTempo(newTemp)
            reset();
        }
        // else {
        //     await promisedSetState({ setTempo, tempo: undefined });
        // }
    };

    const tempoIncrement = (int) => {
        let newTemp = tempo + int;
        if (newTemp >= 20 && newTemp <= 400) {
            tempoChange(newTemp);
        }
    };


    function tapTempo() {
        let lastTime = tapTime;
        let time = Date.now();
        setTimeSinceTap(time - lastTime)
        setTapTime(time)
        let newTemp = getAverageTime();
        if (typeof newTemp === "number") {
            tempoChange(Math.floor(newTemp));
        }
    };
    function getAverageTime() {
        if (timeSinceTap > 3000) {
            setTapCount(0)
            setTapTimeTotal(0)
        } else {

            setTapCount(prevCount => prevCount + 1)
            setTapTimeTotal(prevTime => prevTime + timeSinceTap)
            let avg = tapTimeTotal / tapCount;
            if (avg) {
                return 60000 / avg;
            }
        }
    };

    const startSecondary = async () => {
        setSecondaryRunning(true)
    };

    const stopSecondary = async () => {
        setSecondaryRunning(false)
        clearInterval(secondaryMetLoop.current);
    };

    async function startTernary() {
        setTernaryRunning(true)
        reset();
    };

    async function stopTernary() {
        setTernaryRunning(false)
        clearInterval(ternaryMetLoop.current);
    };

    function playTernary() {
        let like = likelihood;

        let ternaryTempoMs =
            (60000 / tempo / polyBottom) * polyTop;
        if (ternaryRunning) {
            clave4.play();
            ternaryMetLoop.current = setInterval(() => {
                if (random) {
                    if (Math.random() < like / 100) {
                        clave4.play();
                    }
                } else {
                    clave4.play();
                }
            }, ternaryTempoMs);
        }
    };

    function playSecondary() {
        let like = likelihood;
        let subTempoMs = 60000 / tempo / divisor;
        let subCount = 0;
        if (secondaryRunning) {
            secondaryMetLoop.current = setInterval(function () {
                if (subCount !== divisor - 1) {
                    if (random) {
                        if (Math.random() < like / 100) {
                            // clave3.play();
                            console.log('hit 1')
                        }
                    } else {
                        // clave3.play();
                        console.log('hit 1')
                    }
                }
                subCount++;
            }, subTempoMs);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 15
        },
        animationContainer: {
            // ... 
        },
        animationBall: {
            // ...
        },
        button: {
            padding: 10,
            backgroundColor: '#e0e0e0',
            borderRadius: 5,
            alignItems: 'center'
        },
        fieldContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        separator: {
            height: 1,
            backgroundColor: '#ccc',
            marginVertical: 10
        },
        subdivPolyContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        subdivContainer: {
            flex: 1,
            alignItems: 'center'
        },
        polyContainer: {
            flex: 1,
            alignItems: 'center'
        },
        verticalSeparator: {
            width: 1,
            backgroundColor: '#ccc',
            height: '100%'
        },
        input: {
            borderWidth: 1,
            borderColor: '#e0e0e0',
            padding: 5,
            width: 50,
            textAlign: 'center'
        },
        subdivImage: {
            width: 50,
            height: 50,
            resizeMode: 'contain'
        },
        randomInputContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        }
        // ... other styles ...
    });




    //cached ball element for animation
    // const ballEl = document.querySelector(".met-anim-ball");

    //Howler audio vars
    // var clave = new Howl({ src: [assetsPath + "clave.wav"] });
    // var clave2 = new Howl({ src: [assetsPath + "clave2.wav"] });
    // var clave3 = new Howl({ src: [assetsPath + "clave3.wav"] });
    // var clave4 = new Howl({ src: [assetsPath + "clave4.wav"] });



    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <View style={styles.animationBall} />
            </View>

            {running ? (
                <Pressable style={styles.button} onPress={stop}>
                    <Text>Stop</Text>
                </Pressable>
            ) : (
                <Pressable style={styles.button} onPress={playMet}>
                    <Text>Start</Text>
                </Pressable>
            )}


            {Dimensions.get('window').width < 450 && (
                <Text>Phone must be off silent mode!</Text>

            )}


            <View style={styles.fieldContainer}>
                <Text>Tempo</Text>
                <TextInput
                    style={styles.input}
                    value={tempo.toString()}
                    onChangeText={(text) => tempoChange(Number(text))}
                    inputMode="numeric"
                />
            </View>

            <View style={styles.buttonContainer}>
                {[-10, -5, 5, 10].map((value, index) => (
                    <Pressable
                        key={index}
                        style={styles.button}
                        onPress={() => tempoIncrement(value)}
                    >
                        <Text>{value >= 0 ? `+${value}` : value}</Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.separator} />

            <View style={styles.fieldContainer}>
                <Text>Beats per bar</Text>
                <TextInput
                    style={styles.input}
                    value={beats.toString()}
                    onChangeText={(text) => beatChange(Number(text))}
                    inputMode="numeric"
                />
            </View>

            <View style={styles.separator} />

            <View style={styles.subdivPolyContainer}>

                <View style={styles.subdivContainer}>
                    <Text>Subdivisions</Text>
                    {/* <Image style={styles.subdivImage} source={{ uri: `${assetsPath}${divisor}.png` }} /> */}
                    <TextInput
                        style={styles.input}
                        value={divisor.toString()}
                        onChangeText={(text) => divisorChange(Number(text))}
                        inputMode="numeric"
                        max="8"
                        min="2"
                    />
                    {!secondaryRunning ? (
                        // <TouchableOpacity style={styles.button} onPress={this.startSecondary}>
                        //     <Text>Turn Subdivisions On</Text>
                        // </TouchableOpacity>
                        <View></View>) : (
                        <Pressable style={styles.button} onPress={stopSecondary}>
                            <Text>Turn Subdivisions Off</Text>
                        </Pressable>
                    )}
                </View>

                <View style={styles.verticalSeparator} />

                <View style={styles.polyContainer}>
                    <Text>Polyrhythms</Text>
                    <TextInput
                        style={styles.input}
                        value={polyTop.toString()}
                        onChangeText={(text) => polyTopChange(Number(text))}
                        inputMode="numeric"
                        max="8"
                        min="2"
                    />
                    <Text>:</Text>
                    <TextInput
                        style={styles.input}
                        value={polyBottom.toString()}
                        onChangeText={(text) => polyBottomChange(Number(text))}
                        inputMode="numeric"
                        max="8"
                        min="2"
                    />
                    {!ternaryRunning ? (
                        // <TouchableOpacity style={styles.button} onPress={this.startTernary}>
                        //     <Text>Turn Polyrhythms On</Text>
                        // </TouchableOpacity>
                        <View></View>
                    ) : (
                        <Pressable style={styles.button} onPress={stopTernary}>
                            <Text>Turn Polyrhythms Off</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.randomInputContainer}>
                <Text>Random %</Text>
                <TextInput
                    style={styles.input}
                    value={likelihood.toString()}
                    onChangeText={(text) => likelihoodChange(Number(text))}
                    inputMode="numeric"
                />
            </View>
            {random ? (
                <Pressable style={styles.button} onPress={() => randomToggle(0)}>
                    <Text>Turn Random Off</Text>
                </Pressable>
            ) : (
                <Pressable style={styles.button} onPress={() => randomToggle(1)}>
                    <Text>Turn Random On</Text>
                </Pressable>
            )}

            <View style={styles.separator} />

            <TouchableOpacity style={styles.button} onPress={tapTempo}>
                <Text>Tap Tempo</Text>
            </TouchableOpacity>
            {/* <View></View> */}

        </View>
    )
}