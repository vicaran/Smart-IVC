package com.app.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Andrea on 28/04/2017.
 */
@RestController
@RequestMapping("/suburb")
public class SuburbController {
//
//    private final SuburbRepository suburbRepository;
//
//    @Autowired
//    public SuburbController(SuburbRepository suburbRepository) {
//        this.suburbRepository = suburbRepository;
//    }
//
////    @RequestMapping(value = "/citySuburbs/{id}", method = RequestMethod.GET)
////    public ResponseEntity<?> getSuburbFromCityId(Long id) {
////        Collection<Suburb> suburbList = this.suburbRepository.findSuburbByCityId(id).orElseThrow(NotFoundException::new);
////        return new ResponseEntity<>(suburbList, HttpStatus.OK);
////    }
}
