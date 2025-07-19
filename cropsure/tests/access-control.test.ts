import { describe, it, expect, beforeEach } from "vitest"

const mockContract = {
  admin: "ST1ADMIN00000000000000000000000000000000",
  verifiedEntities: new Map(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  addEntity(caller: string, entity: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    if (this.verifiedEntities.has(entity)) return { error: 101 } // ERR-ALREADY-VERIFIED

    this.verifiedEntities.set(entity, true)
    return { value: true }
  },

  removeEntity(caller: string, entity: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    if (!this.verifiedEntities.has(entity)) return { error: 102 } // ERR-NOT-FOUND
    if (caller === entity) return { error: 103 } // ERR-CANNOT-REMOVE-SELF

    this.verifiedEntities.delete(entity)
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    this.admin = newAdmin
    return { value: true }
  },

  isVerified(entity: string) {
    return this.verifiedEntities.has(entity)
  },

  getAdmin() {
    return this.admin
  },
}

describe("CropSure Access Control Contract", () => {
  const admin = "ST1ADMIN00000000000000000000000000000000"
  const farmer1 = "ST2FARMER11111111111111111111111111111111"
  const farmer2 = "ST3FARMER22222222222222222222222222222222"
  const outsider = "ST4OUTSIDER33333333333333333333333333333333"

  beforeEach(() => {
    mockContract.admin = admin
    mockContract.verifiedEntities = new Map()
  })

  it("should allow admin to add an entity", () => {
    const result = mockContract.addEntity(admin, farmer1)
    expect(result).toEqual({ value: true })
    expect(mockContract.isVerified(farmer1)).toBe(true)
  })

  it("should prevent non-admin from adding entities", () => {
    const result = mockContract.addEntity(outsider, farmer1)
    expect(result).toEqual({ error: 100 })
    expect(mockContract.isVerified(farmer1)).toBe(false)
  })

  it("should prevent adding the same entity twice", () => {
    mockContract.addEntity(admin, farmer1)
    const result = mockContract.addEntity(admin, farmer1)
    expect(result).toEqual({ error: 101 })
  })

  it("should allow admin to remove a verified entity", () => {
    mockContract.addEntity(admin, farmer1)
    const result = mockContract.removeEntity(admin, farmer1)
    expect(result).toEqual({ value: true })
    expect(mockContract.isVerified(farmer1)).toBe(false)
  })

  it("should prevent removing a non-verified entity", () => {
    const result = mockContract.removeEntity(admin, farmer2)
    expect(result).toEqual({ error: 102 })
  })

  it("should prevent non-admin from removing any entity", () => {
    mockContract.addEntity(admin, farmer1)
    const result = mockContract.removeEntity(outsider, farmer1)
    expect(result).toEqual({ error: 100 })
    expect(mockContract.isVerified(farmer1)).toBe(true)
  })

  it("should prevent admin from removing themselves", () => {
    mockContract.addEntity(admin, admin)
    const result = mockContract.removeEntity(admin, admin)
    expect(result).toEqual({ error: 103 }) // ERR-CANNOT-REMOVE-SELF
    expect(mockContract.isVerified(admin)).toBe(true)
  })

  it("should allow admin to transfer admin rights", () => {
    const result = mockContract.transferAdmin(admin, farmer1)
    expect(result).toEqual({ value: true })
    expect(mockContract.getAdmin()).toBe(farmer1)
  })

  it("should prevent non-admin from transferring admin rights", () => {
    const result = mockContract.transferAdmin(outsider, farmer1)
    expect(result).toEqual({ error: 100 })
    expect(mockContract.getAdmin()).toBe(admin)
  })

  it("new admin should be able to manage verification", () => {
    mockContract.transferAdmin(admin, farmer1)

    const addResult = mockContract.addEntity(farmer1, farmer2)
    expect(addResult).toEqual({ value: true })
    expect(mockContract.isVerified(farmer2)).toBe(true)
  })

  it("should return current admin", () => {
    expect(mockContract.getAdmin()).toBe(admin)
  })
})
