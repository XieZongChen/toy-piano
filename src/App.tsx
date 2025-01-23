import { useEffect, useMemo } from 'react';
import { styled, createGlobalStyle, css } from 'styled-components';

function App() {
  const keys: Record<string, { frequency: number }> = {
    A: {
      frequency: 196, // 琴键对应声音频率
    },
    S: {
      frequency: 220,
    },
    D: {
      frequency: 246,
    },
    F: {
      frequency: 261,
    },
    G: {
      frequency: 293,
    },
    H: {
      frequency: 329,
    },
    J: {
      frequency: 349,
    },
    K: {
      frequency: 392,
    },
  };

  // 全局样式
  const GlobalStyles = createGlobalStyle`
    body {
      background: #000;
    }
    .pressed {
      background: #aaa;
    }
  `;

  // styled.xxx 写样式组件
  const KeysStyle = styled.div`
    width: 800px;
    height: 400px;
    margin: 40px auto;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
  `;

  // 创建复用的 css 片段
  const textStyle = css`
    line-height: 500px;
    text-align: center;
    font-size: 50px;
  `;

  const KeyStyle = styled.div`
    border: 4px solid black;
    background: #fff;
    flex: 1;
    ${textStyle}

    &:hover {
      background: #aaa;
    }
  `;

  const context = useMemo(() => {
    // 创建 AudioContext，这个不需要每次渲染都创建，所以用 useMemo 包裹
    return new AudioContext();
  }, []);

  const play = (key: string) => {
    // 通过琴键拿到对应声音频率
    const frequency = keys[key]?.frequency;
    if (!frequency) {
      return;
    }

    // 创建 oscillator 节点
    const osc = context.createOscillator();
    osc.type = 'sine';

    // 创建 gain 节点
    const gain = context.createGain();
    osc.connect(gain); // 将 gain 连接到 oscillator 节点上
    gain.connect(context.destination); // 将 destination 连接到 gain 节点上

    /**
     * 以下设置为了在按一个琴键时，发出的声音更自然
     * 按每个键声音都是一秒，但这一秒内有音量从小到大再到小的变化
     */
    osc.frequency.value = frequency; // 设置频率
    gain.gain.setValueAtTime(0, context.currentTime); // 在 currentTime 设置音量为 0
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01); // currentTime + 0.01 秒设置音量为 1，也就是声音是逐渐变大的（linear 是线性）

    osc.start(context.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1); // currentTime + 1 秒后设置音量为 0.001，也就是声音指数级的变小。（exponential 是指数级）
    osc.stop(context.currentTime + 1); // start 到 stop 间隔 1 秒

    // 琴键按键样式
    document.getElementById(`key-${key}`)?.classList.add('pressed');
    setTimeout(() => {
      document.getElementById(`key-${key}`)?.classList.remove('pressed');
    }, 100);
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      play(e.key.toUpperCase());
    });
  });

  // 简谱映射到琴键
  const map: Record<number, string> = {
    1: 'A',
    2: 'S',
    3: 'D',
    4: 'F',
    5: 'G',
    6: 'H',
    7: 'J',
    8: 'K',
  };

  /**
   * 演奏音乐方法
   * @param music 音节和音节长度组成的二维数组
   * @param speed 调整整首曲子的速度
   */
  function playMusic(music: number[][], speed = 1) {
    let startTime = 0;
    music.forEach((item) => {
      setTimeout(() => {
        play(map[item[0]]);
      }, startTime * speed);
      startTime += item[1];
    });
  }

  function playSong1() {
    const music = [
      [6, 1000],
      [5, 1000],
      [3, 1000],
      [5, 1000],
      [8, 1000],
      [6, 500],
      [5, 500],
      [6, 1000],
    ];

    playMusic(music);
  }

  function playSong2() {
    const music = [
      [6, 1000],
      [6, 1000],
      [6, 1000],
      [3, 500],
      [6, 500],
      [5, 1000],
      [3, 500],
      [2, 500],
      [3, 1000],
    ];

    playMusic(music, 0.5);
  }

  return (
    <div>
      <KeysStyle as='section'>
        {Object.keys(keys).map((item: any) => {
          return (
            <KeyStyle as='div' key={item}>
              <div onClick={() => play(item)} id={`key-${item}`}>
                <span>{item}</span>
              </div>
            </KeyStyle>
          );
        })}
        <GlobalStyles />
      </KeysStyle>
      <div className='songs'>
        <button onClick={() => playSong1()}>世上只有妈妈好</button>
        <button onClick={() => playSong2()}>奢香夫人</button>
      </div>
    </div>
  );
}

export default App;
