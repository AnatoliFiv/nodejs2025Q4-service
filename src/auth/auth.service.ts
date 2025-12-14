import {
  Injectable,
  ForbiddenException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshDto } from './dto/refresh.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { IUsersRepository } from '../users/repositories/users.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ id: string }> {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.usersRepository.create({
      login: signupDto.login,
      password: hashedPassword,
    });

    return { id: user.id };
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.usersRepository.findByLogin(loginDto.login);

    if (!user) {
      throw new ForbiddenException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid login or password');
    }

    const payload = { userId: user.id, login: user.login };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto): Promise<TokenResponseDto> {
    if (!refreshDto.refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const secret = process.env.JWT_SECRET_REFRESH_KEY || 'secret123123';

      const payload = this.jwtService.verify(refreshDto.refreshToken, {
        secret,
      });

      const { userId, login } = payload;
      const newPayload = { userId, login };

      return {
        accessToken: this.generateAccessToken(newPayload),
        refreshToken: this.generateRefreshToken(newPayload),
      };
    } catch (error) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }

  private generateAccessToken(payload: {
    userId: string;
    login: string;
  }): string {
    const secret = process.env.JWT_SECRET_KEY || 'secret123123';
    const expiresIn = process.env.TOKEN_EXPIRE_TIME || '1h';
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  private generateRefreshToken(payload: {
    userId: string;
    login: string;
  }): string {
    const secret = process.env.JWT_SECRET_REFRESH_KEY || 'secret123123';
    const expiresIn = process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h';
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }
}
