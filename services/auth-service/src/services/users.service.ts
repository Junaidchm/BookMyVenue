import { prisma } from '../prisma/prisma';

export class UsersService {
  async findByEmail(email: string) {
    const sanitizedEmail = email.toLowerCase().trim();
    return await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        ownerProfile: true,
      },
    });
  }

  async createUser(
    email: string,
    passwordHash: string,
    fullName: string,
    roles?: string[],
  ) {
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedRoles = roles && roles.length > 0 ? roles : ['USER'];

    // Check if user already exists
    const existingUser = await this.findByEmail(sanitizedEmail);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    return prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: sanitizedEmail,
          passwordHash,
          fullName,
        },
      });

      // Ensure roles exist and assign them to the user
      for (const roleName of sanitizedRoles) {
        const upperRoleName = roleName.toUpperCase().trim();

        // Upsert the role
        const role = await tx.role.upsert({
          where: { name: upperRoleName },
          update: {},
          create: {
            name: upperRoleName,
            description: `${upperRoleName} role`,
          },
        });

        // Link user to role
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: sanitizedRoles.map((r) => r.toUpperCase().trim()),
      };
    });
  }

  async updateOwnerProfile(
    userId: number,
    profileData: {
      phoneNumber?: string;
      businessName?: string;
      bankRoutingNumber?: string;
      bankAccountNumber?: string;
    },
  ) {
    return await prisma.ownerProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    });
  }

  async findAllUsers() {
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles.map((ur) => ur.role.name),
    }));
  }
}
