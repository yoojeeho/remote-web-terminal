import RemoteWebTerminalBackend from "../src/remote-web-terminal-backend"

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("DummyClass is instantiable", () => {
    expect(new RemoteWebTerminalBackend("/", 1234)).toBeInstanceOf(RemoteWebTerminalBackend)
  })
})
