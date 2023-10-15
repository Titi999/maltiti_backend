import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Cooperative} from "../entities/Cooperative.entity";
import {Repository} from "typeorm";
import {CooperativeMember} from "../entities/CooperativeMember.entity";
import {AddCooperativeDto} from "../dto/addCooperative.dto";
import {EditCooperativeDto} from "../dto/editCooperative.dto";
import {AddCooperativeMemberDto} from "../dto/addCooperativeMember.dto";
import {EditCooperativeMemberDto} from "../dto/editCooperativeMember.dto";

@Injectable()
export class CooperativeService {
    constructor(
        @InjectRepository(Cooperative)
        private readonly cooperativeRepository: Repository<Cooperative>,
        @InjectRepository(CooperativeMember)
        private readonly cooperativeMemberRepository: Repository<CooperativeMember>
    ) {
    }

    async createCooperative(cooperativeInfo: AddCooperativeDto): Promise<Cooperative> {
        const cooperative = new Cooperative()

        if(await this.findCooperativeByName(cooperativeInfo.name))
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Cooperative with name already exists',
            }, HttpStatus.CONFLICT);

        cooperative.name = cooperativeInfo.name
        cooperative.community = cooperativeInfo.community
        cooperative.minimalShare = cooperativeInfo.minimalShare
        cooperative.registrationFee = cooperativeInfo.registrationFee
        cooperative.monthlyFee = cooperativeInfo.monthlyFee

        return this.cooperativeRepository.save(cooperative)
    }

    async editCooperative(cooperativeInfo: EditCooperativeDto): Promise<Cooperative> {
        const cooperative = await this.findOneCooperative(cooperativeInfo.id)

        cooperative.name = cooperativeInfo.name
        cooperative.community = cooperativeInfo.community

        return this.cooperativeRepository.save(cooperative)
    }

    async deleteCooperative(id: string) {
        return this.cooperativeRepository.delete({id: id})
    }

    async getAllCooperatives(page: number = 1, limit: number = 10, searchTerm: string = '') {
        const skip = (page - 1) * limit;

        const queryBuilder = this.cooperativeRepository
            .createQueryBuilder('cooperative')
            .skip(skip)
            .take(limit);

        if (searchTerm) {
            queryBuilder.where('cooperative.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
        }

        const [cooperatives, totalItems] = await queryBuilder.getManyAndCount();

        return {
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            cooperatives,
        };
    }

    async findOneCooperative(id: string) {
        return this.cooperativeRepository.findOneBy({id: id})
    }

    async createCooperativeMember(memberInfo: AddCooperativeMemberDto) {
        const member = new CooperativeMember()

        member.name = memberInfo.name
        member.community = memberInfo.community
        member.cooperative = memberInfo.cooperative
        member.dob = memberInfo.dob
        member.crops = memberInfo.crops
        member.district = memberInfo.district
        member.education = memberInfo.education
        member.farmSize = memberInfo.farmSize
        member.gpsAddress = memberInfo.gpsAddress
        member.houseNumber = memberInfo.houseNumber
        member.idNumber = memberInfo.idNumber
        member.idType = memberInfo.idType
        member.image = memberInfo.image
        member.occupation = memberInfo.occupation
        member.phoneNumber = memberInfo.phoneNumber
        member.region = memberInfo.region
        member.secondaryOccupation = memberInfo.secondaryOccupation

        return this.cooperativeMemberRepository.save(member)
    }

    async editMember(memberInfo: EditCooperativeMemberDto): Promise<CooperativeMember> {
        const member = await this.findOneMember(memberInfo.id)

        member.name = memberInfo.name
        member.community = memberInfo.community
        member.cooperative = memberInfo.cooperative
        member.dob = memberInfo.dob
        member.crops = memberInfo.crops
        member.district = memberInfo.district
        member.education = memberInfo.education
        member.farmSize = memberInfo.farmSize
        member.gpsAddress = memberInfo.gpsAddress
        member.houseNumber = memberInfo.houseNumber
        member.idNumber = memberInfo.idNumber
        member.idType = memberInfo.idType
        member.image = memberInfo.image
        member.occupation = memberInfo.occupation
        member.phoneNumber = memberInfo.phoneNumber
        member.region = memberInfo.region
        member.secondaryOccupation = memberInfo.secondaryOccupation

        return this.cooperativeMemberRepository.save(member)
    }

    async deleteMember(id: string) {
        return this.cooperativeMemberRepository.delete({id: id})
    }

    async getAllMembers(page: number = 1, limit: number = 10, searchTerm: string = '') {
        const skip = (page - 1) * limit;

        const queryBuilder = this.cooperativeMemberRepository
            .createQueryBuilder('cooperativeMember')
            .skip(skip)
            .take(limit);

        if (searchTerm) {
            queryBuilder.where('cooperativeMember.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
        }

        const [members, totalItems] = await queryBuilder.getManyAndCount();

        return {
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            members,
        };
    }

    async findOneMember(id: string) {
        return this.cooperativeMemberRepository.findOneBy({id: id})
    }

    async findCooperativeByName(name: string) {
        return this.cooperativeRepository.findOneBy({ name })
    }
}
