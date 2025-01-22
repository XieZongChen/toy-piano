import { styled, createGlobalStyle, css } from 'styled-components';

function App() {
  const keys: Record<string, { frequency: number }> = {
    A: {
      frequency: 196, // 音节对应声音频率
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

  const play = (key: string) => {
    const frequency = keys[key]?.frequency;
    if (!frequency) {
      return;
    }
  };

  return (
    <KeysStyle as='section'>
      {Object.keys(keys).map((item: any) => {
        return (
          <KeyStyle as='div' key={item}>
            <div onClick={() => play(item)}>
              <span>{item}</span>
            </div>
          </KeyStyle>
        );
      })}
      <GlobalStyles />
    </KeysStyle>
  );
}

export default App;
