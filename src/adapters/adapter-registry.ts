export class AdapterRegistry {
  private adapters: Map<string, any> = new Map()

  register(name: string, adapter: any): void {
    this.adapters.set(name, adapter)
  }

  get(name: string): any {
    return this.adapters.get(name)
  }

  has(name: string): boolean {
    return this.adapters.has(name)
  }
}
