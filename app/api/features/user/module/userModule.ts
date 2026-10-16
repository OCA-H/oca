import "server-only";
import { UserController } from "../controller/userController";
import { UserRepository } from "../repository/userRepository";
import { UserService } from "../services/userService";

export const userRepository = new UserRepository();
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);
