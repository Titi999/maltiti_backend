import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {CooperativeService} from "./cooperative.service";
import {IResponse} from "../interfaces/general";
import {AddCooperativeDto} from "../dto/addCooperative.dto";
import {EditCooperativeDto} from "../dto/editCooperative.dto";
import {AddCooperativeMemberDto} from "../dto/addCooperativeMember.dto";
import {EditCooperativeMemberDto} from "../dto/editCooperativeMember.dto";
import {JwtAuthGuard} from "../authentication/guards/jwt-auth.guard";

@Controller('cooperative')
export class CooperativeController {
    constructor(private cooperativeService: CooperativeService) {}
    @UseGuards(JwtAuthGuard)
    @Get('cooperatives')
    async getAllCooperatives(): Promise<IResponse> {
        const cooperatives = await this.cooperativeService.getAllCooperatives();

        return {
            message: 'Cooperatives loaded successfully',
            data: cooperatives
        }
    }

    @Get('cooperative/:id')
    async getCooperative(@Param('id') id: string) {
        const cooperative = await this.cooperativeService.findOneCooperative(id)

        return {
            message: 'Cooperative loaded successfully',
            data: cooperative
        }
    }

    @Post('add-cooperative')
    async addCooperative(@Body() cooperativeInfo: AddCooperativeDto) {
        const cooperative = await this.cooperativeService.createCooperative(cooperativeInfo)

        return {
            message: 'Cooperative created successfully',
            data: cooperative
        }
    }

    @Patch('edit-cooperative')
    async editCooperative(cooperativeInfo: EditCooperativeDto) {
        const cooperative = await this.cooperativeService.editCooperative(cooperativeInfo)

        return {
            message: 'Cooperatives edit successfully',
            data: cooperative
        }
    }

    @Delete('delete-cooperative/:id')
    async deleteCooperative(@Param('id') id: string) {
        const deleteResult = await this.cooperativeService.deleteCooperative(id)

        return {
            message: 'Cooperatives deleted successfully',
            data: deleteResult
        }
    }

    @Get('members')
    async getAllCooperativeMembers(): Promise<IResponse> {
        const cooperativeMembers = await this.cooperativeService.getAllMembers()

        return {
            message: 'Cooperative Members loaded successfully',
            data: cooperativeMembers
        }
    }

    @Get('cooperative-members')
    async getCooperativeMembers() {
        const cooperative = await this.cooperativeService.findOneCooperative('')

        return {
            message: 'Cooperative loaded successfully',
            data: cooperative
        }
    }

    @Get('add-member')
    async addMember(memberInfo: AddCooperativeMemberDto) {
        const cooperativeMember = await this.cooperativeService.createCooperativeMember(memberInfo)

        return {
            message: 'Cooperative member created successfully',
            data: cooperativeMember
        }
    }

    @Patch('edit-member')
    async editMember(memberInfo: EditCooperativeMemberDto) {
        const cooperativeMember = await this.cooperativeService.editMember(memberInfo)

        return {
            message: 'Member edit successfully',
            data: cooperativeMember
        }
    }

    @Delete('delete-member/:id')
    async deleteMember(@Param('id') id: string) {
        const deleteResult = await this.cooperativeService.deleteMember(id)

        return {
            message: 'Member deleted successfully',
            data: deleteResult
        }
    }

}
